// Kakao Map JS SDK 로더 — 브라우저에서 스크립트를 1회만 주입하고 로드 완료를 기다린다.
// 공식 타입 패키지를 쓰지 않으므로 이 프로젝트에서 쓰는 범위만 최소로 선언한다.
export interface KakaoMapsSdk {
  maps: {
    load: (callback: () => void) => void;
    LatLng: new (lat: number, lng: number) => unknown;
    Map: new (
      container: HTMLElement,
      options: { center: unknown; level: number; mapTypeId?: unknown },
    ) => {
      setCenter: (latlng: unknown) => void;
      setBounds: (bounds: unknown) => void;
      addControl: (control: unknown, position: unknown) => void;
      setZoomable: (zoomable: boolean) => void;
      getLevel: () => number;
      setLevel: (level: number) => void;
    };
    LatLngBounds: new () => {
      extend: (latlng: unknown) => void;
    };
    MapTypeId: {
      HYBRID: unknown;
      ROADMAP: unknown;
      SKYVIEW: unknown;
    };
    MapTypeControl: new () => unknown;
    ZoomControl: new () => unknown;
    ControlPosition: {
      TOPRIGHT: unknown;
      RIGHT: unknown;
    };
    Marker: new (options: {
      position: unknown;
      map?: unknown;
      image?: unknown;
    }) => {
      setMap: (map: unknown) => void;
      setImage: (image: unknown) => void;
    };
    MarkerImage: new (
      src: string,
      size: unknown,
      options?: { offset?: unknown },
    ) => unknown;
    Size: new (width: number, height: number) => unknown;
    Point: new (x: number, y: number) => unknown;
    CustomOverlay: new (options: {
      position: unknown;
      content: HTMLElement;
      yAnchor?: number;
    }) => {
      setMap: (map: unknown) => void;
    };
    services: {
      Places: new () => {
        keywordSearch: (
          keyword: string,
          callback: (
            places: Array<{ place_name: string; x: string; y: string }>,
            status: string,
          ) => void,
        ) => void;
      };
      Status: {
        OK: string;
      };
    };
  };
}

declare global {
  interface Window {
    kakao?: KakaoMapsSdk;
  }
}

let loadPromise: Promise<KakaoMapsSdk> | null = null;

/** Kakao Map JS SDK를 1회만 로드하고 kakao 전역 객체를 반환한다. */
export function loadKakaoMapSdk(appKey: string): Promise<KakaoMapsSdk> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("브라우저 환경에서만 로드할 수 있습니다."));
  }
  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao!.maps.load(() => resolve(window.kakao!));
    };
    script.onerror = () => reject(new Error("Kakao Map SDK 로드에 실패했습니다."));
    document.head.appendChild(script);
  });

  return loadPromise;
}
