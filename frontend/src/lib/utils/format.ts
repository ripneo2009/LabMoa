// 날짜/시간 포맷 헬퍼 — Node(서버)와 브라우저(클라이언트)의 ko-KR 오전/오후 로캘 문자열이
// ICU 데이터 버전에 따라 다르게 나올 수 있어("오후" vs "PM") 하이드레이션 불일치를 일으킨다.
// hour12: false로 24시간제 숫자만 쓰면 로캘 문자열 자체가 없어 이 문제가 원천 차단된다.

/** "15:41" — 시:분만 */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** "2026. 08. 05. 15:41" — 연월일 + 시:분 */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** "08. 05. 15:41" — 월일 + 시:분 (연도 생략) */
export function formatShortDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
