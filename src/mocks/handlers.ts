// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export type Showtime = {
  id: string;
  movie: string;
  auditorium: string;
  startsAt: string; // ISO
};
export type Seat = {
  id: string;   // e.g., "A1"
  row: string;  // "A"
  number: number; // 1
  reserved: boolean;
};

// --- mock data ---
const showtimes: Showtime[] = [
  { id: "s1", movie: "Interstellar",   auditorium: "IMAX",     startsAt: new Date(Date.now() + 1000 * 60 * 90 ).toISOString() },
  { id: "s2", movie: "Inside Out 2",   auditorium: "Screen 2", startsAt: new Date(Date.now() + 1000 * 60 * 150).toISOString() },
  { id: "s3", movie: "Dune: Part Two", auditorium: "Screen 3", startsAt: new Date(Date.now() + 1000 * 60 * 210).toISOString() },
];

const ROWS = ["A", "B", "C", "D", "E", "F"];
const COLS = 10;

// showtimeId -> reserved seats
const reservedMap: Record<string, Set<string>> = Object.fromEntries(
  showtimes.map(s => [s.id, new Set<string>(s.id === "s1" ? ["B5","B6","C3"] : [])])
);

const firstShowtimeId = showtimes[0].id;

function seatsOf(showtimeId: string): Seat[] {
  const set = reservedMap[showtimeId] ?? (reservedMap[showtimeId] = new Set<string>());
  return ROWS.flatMap(row =>
    Array.from({ length: COLS }, (_, i) => {
      const number = i + 1;
      const id = `${row}${number}`;
      return { id, row, number, reserved: set.has(id) };
    })
  );
}

// 환경변수에서 BASE_URL 가져오기 (MSW 핸들러용)
const MSW_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const handlers = [
  // 상영 목록
  http.get(`${MSW_BASE_URL}/api/showtimes`, () => HttpResponse.json(showtimes)),

  // 좌석 조회 (기본값: 첫 상영)
  http.get(`${MSW_BASE_URL}/api/seats`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("showtimeId");
    const showtimeId = showtimes.some(s => s.id === q) ? (q as string) : firstShowtimeId;
    return HttpResponse.json({ showtimeId, seats: seatsOf(showtimeId) });
  }),

  // 예약 (검증/충돌 체크 없음, 그냥 반영)
  http.post(`${MSW_BASE_URL}/api/reserve`, async ({ request }) => {
    const { showtimeId, seats = [] } = (await request.json()) as {
      showtimeId?: string;
      seats?: string[];
    };
    const id = showtimes.some(s => s.id === showtimeId) ? (showtimeId as string) : firstShowtimeId;

    const set = reservedMap[id] ?? (reservedMap[id] = new Set<string>());
    seats.forEach(s => set.add(s));

    const code = `BK-${id}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
    return HttpResponse.json({ ok: true, code }, { status: 201 });
  }),
];
