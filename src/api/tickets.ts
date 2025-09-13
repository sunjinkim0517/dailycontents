import type { Showtime, Seat } from "../mocks/handlers";

// 1) 베이스 URL 결정
// - VITE_API_BASE_URL이 있으면 그걸 사용
// - 없으면: 개발(dev)에서는 http://localhost:8080, 프로덕션에서는 현재 오리진
const RAW_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)
  ?? (import.meta.env.DEV ? "http://localhost:8080" : window.location.origin);

// 마지막 슬래시 제거
const API_BASE = RAW_BASE.replace(/\/$/, "");

// path를 붙여서 절대 URL 생성
const api = (path: string) => `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

// ------------------------------------------------------------------

export async function getShowtimes(): Promise<Showtime[]> {
  const res = await fetch(api("/api/showtimes"));
  if (!res.ok) throw new Error(`GET /api/showtimes ${res.status}`);
  return res.json();
}

export async function getSeats(
  showtimeId: string
): Promise<{ showtimeId: string; seats: Seat[] }> {
  const url = new URL(api("/api/seats"));
  url.searchParams.set("showtimeId", showtimeId);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`GET /api/seats ${res.status}`);
  return res.json();
}

export async function reserveSeats(
  showtimeId: string,
  seats: string[]
): Promise<{ ok: boolean; code: string }> {
  const res = await fetch(api("/api/reserve"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // 쿠키/세션 쓰면 아래 줄을 추가:
    // credentials: "include",
    body: JSON.stringify({ showtimeId, seats }),
  });

  if (res.status === 409) {
    const data = await res.json();
    throw new Error(`이미 예약된 좌석: ${data.conflicts?.join(", ")}`);
  }
  if (!res.ok) throw new Error(`POST /api/reserve ${res.status}`);
  return res.json();
}