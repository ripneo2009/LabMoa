"use client"

// 검색 결과 지도 — Kakao Map. API 키가 없으면 회색 placeholder + 좌표 콘솔 출력으로 대체한다.
// 지도 인스턴스는 한 번만 만들고, 검색 결과(labs)가 바뀔 때마다 마커를 다시 그려 전체가
// 보이도록 범위를 맞춘다(setBounds). 마커는 CustomOverlay(DOM 요소)로 만들어 등장 시
// stagger로 떨어져 들어오고, hover 시 motion으로 확대되며, 클릭하면 목록의 해당 카드를
// 선택 상태로 알린다(§4.4 hover 동기화를 역방향으로도 지원).
import * as React from "react"
import { createPortal } from "react-dom"
import { motion } from "motion/react"

import { loadKakaoMapSdk, type KakaoMapsSdk } from "@/lib/external/kakao-map"
import { publicEnv } from "@/lib/config/public-env"
import { SPRING, STAGGER } from "@/lib/constants/motion"

type KakaoMapInstance = InstanceType<KakaoMapsSdk["maps"]["Map"]>
type KakaoOverlayInstance = InstanceType<KakaoMapsSdk["maps"]["CustomOverlay"]>

/** 지도에 마커를 찍는 데 필요한 최소 정보 — 검색 결과(LabSearchResult)든 랩 상세(Lab)든
 * 이 모양만 만족하면 그대로 넘길 수 있다. */
export interface LabMapPin {
  id: string
  name: string
  lat?: number
  lng?: number
  /** 좌표가 없는 AI 추천 기관을 Kakao 장소검색으로 찾을 때 사용한다. */
  mapQuery?: string
}

interface ResolvedLabMapPin extends LabMapPin {
  lat: number
  lng: number
}

export interface LabMapProps {
  labs: LabMapPin[]
  hoveredLabId: string | null
  onSelectLab?: (labId: string) => void
}

const DAEJEON_CENTER = { lat: 36.3504, lng: 127.3845 }

function LabMap({ labs, hoveredLabId, onSelectLab }: LabMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const kakaoRef = React.useRef<KakaoMapsSdk | null>(null)
  const mapRef = React.useRef<KakaoMapInstance | null>(null)
  const overlaysRef = React.useRef<KakaoOverlayInstance[]>([])
  const [mapReady, setMapReady] = React.useState(false)
  const [mapFailed, setMapFailed] = React.useState(false)
  const [markerContainers, setMarkerContainers] = React.useState<
    Record<string, HTMLDivElement>
  >({})
  const [resolvedLabs, setResolvedLabs] = React.useState<ResolvedLabMapPin[]>([])

  const appKey = publicEnv.kakaoMapKey
  const sourceKey = labs
    .map((lab) => `${lab.id}:${lab.lat ?? ""}:${lab.lng ?? ""}:${lab.mapQuery ?? ""}`)
    .join(",")
  const labIds = resolvedLabs.map((lab) => lab.id).join(",")

  // 지도 인스턴스는 한 번만 생성한다
  React.useEffect(() => {
    if (!appKey) {
      // Kakao 키가 없을 때의 fallback: 좌표만 콘솔에 출력한다
      labs.forEach((lab) => {
        console.log(`[LabMap] ${lab.name}: (${lab.lat}, ${lab.lng})`)
      })
      return
    }
    if (!containerRef.current) return

    let cancelled = false
    let loaded = false
    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled && !loaded) setMapFailed(true)
    }, 6000)

    let cleanupWheel: (() => void) | undefined

    loadKakaoMapSdk(appKey).then((kakao) => {
      if (cancelled || !containerRef.current) return
      loaded = true
      const center = new kakao.maps.LatLng(DAEJEON_CENTER.lat, DAEJEON_CENTER.lng)
      kakaoRef.current = kakao
      // 위성사진 + 도로/지명 라벨이 겹쳐 보이는 HYBRID를 기본값으로 — 지도 종류 전환
      // 컨트롤(MapTypeControl)을 같이 붙여 일반 지도로도 바로 바꿀 수 있게 한다.
      const map = new kakao.maps.Map(containerRef.current, {
        center,
        level: 9,
        mapTypeId: kakao.maps.MapTypeId.HYBRID,
      })
      map.addControl(new kakao.maps.MapTypeControl(), kakao.maps.ControlPosition.TOPRIGHT)
      // 마우스 휠 확대/축소를 끄면 지도 위에서 스크롤할 때 페이지가 자연스럽게 스크롤된다.
      // 확대/축소는 우측 +/- 버튼(ZoomControl)이나 Ctrl(⌘)+스크롤로만 하게 한다.
      map.setZoomable(false)
      map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT)

      const container = containerRef.current
      // 트랙패드는 한 번의 제스처에서 작은 deltaY를 수십 번 나눠 쏘기 때문에, 이벤트당
      // 1레벨씩 바꾸면 살짝만 스크롤해도 확대/축소가 크게 튄다. deltaY를 누적했다가
      // 임계값(WHEEL_ZOOM_THRESHOLD)을 넘을 때만 한 레벨 바꿔 체감 감도를 낮춘다.
      const WHEEL_ZOOM_THRESHOLD = 60
      let wheelAccum = 0
      const handleWheel = (event: WheelEvent) => {
        if (!event.ctrlKey && !event.metaKey) return
        event.preventDefault()
        wheelAccum += event.deltaY
        if (Math.abs(wheelAccum) < WHEEL_ZOOM_THRESHOLD) return
        const delta = wheelAccum > 0 ? 1 : -1
        wheelAccum = 0
        map.setLevel(map.getLevel() + delta)
      }
      container.addEventListener("wheel", handleWheel, { passive: false })
      cleanupWheel = () => container.removeEventListener("wheel", handleWheel)

      mapRef.current = map
      setMapReady(true)
    }).catch((error) => {
      console.error("Kakao map unavailable; using OpenStreetMap fallback", error)
      if (!cancelled) setMapFailed(true)
    })

    return () => {
      cancelled = true
      window.clearTimeout(fallbackTimer)
      cleanupWheel?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appKey])

  // AI 추천 기관처럼 좌표가 없는 항목은 Kakao 장소검색 결과의 첫 위치를 사용한다.
  React.useEffect(() => {
    let cancelled = false
    const located = labs.filter(
      (lab): lab is ResolvedLabMapPin =>
        typeof lab.lat === "number" && typeof lab.lng === "number",
    )

    if (located.length === labs.length) {
      setResolvedLabs(located)
      return
    }

    const kakao = kakaoRef.current
    if (!mapReady || !kakao?.maps.services) return

    const placesService = new kakao.maps.services.Places()
    Promise.all(
      labs.map(async (lab): Promise<ResolvedLabMapPin | null> => {
        if (typeof lab.lat === "number" && typeof lab.lng === "number") return lab as ResolvedLabMapPin
        const keyword = lab.mapQuery || lab.name

        return new Promise((resolve) => {
          placesService.keywordSearch(keyword, (places, status) => {
            if (status !== kakao.maps.services.Status.OK || !places[0]) {
              resolve(null)
              return
            }
            const lat = Number(places[0].y)
            const lng = Number(places[0].x)
            resolve(Number.isFinite(lat) && Number.isFinite(lng) ? { ...lab, lat, lng } : null)
          })
        })
      }),
    ).then((results) => {
      if (!cancelled) {
        setResolvedLabs(results.filter((lab): lab is ResolvedLabMapPin => lab !== null))
      }
    })

    return () => {
      cancelled = true
    }
    // sourceKey는 labs의 지도 관련 필드 변화를 안정적으로 대표한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, sourceKey])

  // labs가 바뀔 때마다(검색·필터 변경) 마커를 다시 그리고 전체가 보이도록 범위를 맞춘다
  React.useEffect(() => {
    const kakao = kakaoRef.current
    const map = mapRef.current
    if (!kakao || !map) return

    overlaysRef.current.forEach((overlay) => overlay.setMap(null))
    overlaysRef.current = []

    const nextContainers: Record<string, HTMLDivElement> = {}
    resolvedLabs.forEach((lab) => {
      const el = document.createElement("div")
      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(lab.lat, lab.lng),
        content: el,
        yAnchor: 0.5,
      })
      overlay.setMap(map)
      overlaysRef.current.push(overlay)
      nextContainers[lab.id] = el
    })
    setMarkerContainers(nextContainers)

    if (resolvedLabs.length > 0) {
      const bounds = new kakao.maps.LatLngBounds()
      resolvedLabs.forEach((lab) => bounds.extend(new kakao.maps.LatLng(lab.lat, lab.lng)))
      map.setBounds(bounds)
    }
    // labIds가 labs의 내용 변화를 안정적으로 대표하는 키 역할을 한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, labIds])

  if (!appKey) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted p-6 text-center">
        <p className="text-sm font-medium text-foreground">지도를 표시할 수 없어요</p>
        <p className="text-xs text-muted-foreground">
          Kakao Map API 키가 설정되지 않았습니다. 연구실 좌표는 브라우저 콘솔에서 확인할 수
          있어요.
        </p>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {mapFailed ? (
        <iframe
          title="대전 연구소 지도"
          src="https://www.openstreetmap.org/export/embed.html?bbox=127.20%2C36.20%2C127.55%2C36.48&layer=mapnik&marker=36.3504%2C127.3845"
          className="h-full w-full border-0"
          loading="eager"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div ref={containerRef} className="h-full w-full" />
      )}
      {resolvedLabs.map((lab, index) => {
        const container = markerContainers[lab.id]
        if (!container) return null
        return createPortal(
          <motion.div
            key={lab.id}
            initial={{ opacity: 0, scale: 0.3, y: -10 }}
            animate={{ opacity: 1, scale: hoveredLabId === lab.id ? 1.15 : 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: SPRING.stiffness,
              damping: SPRING.damping,
              delay: index * STAGGER.desktop,
            }}
            onClick={() => onSelectLab?.(lab.id)}
            role="button"
            tabIndex={0}
            aria-label={`${lab.name} 지도에서 보기`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelectLab?.(lab.id)
            }}
            className="size-3 cursor-pointer rounded-full border-2 border-surface bg-primary"
            title={lab.name}
          />,
          container,
          lab.id,
        )
      })}
    </div>
  )
}

export { LabMap }
