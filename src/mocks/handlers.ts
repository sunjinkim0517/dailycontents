import { http, HttpResponse,passthrough } from "msw";


export type Showtime = {
id: string;
movie: string;
auditorium: string;
startsAt: string; // ISO
};export type Seat = {
id: string; // e.g., "A1"
row: string; // "A"
number: number; // 1
reserved: boolean;
};


// ——— In-memory data (mock DB) ———
const showtimes: Showtime[] = [
{
id: "s1",
movie: "Interstellar",
auditorium: "IMAX",
startsAt: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
},
{
id: "s2",
movie: "Inside Out 2",
auditorium: "Screen 2",
startsAt: new Date(Date.now() + 1000 * 60 * 150).toISOString(),
},
{
id: "s3",
movie: "Dune: Part Two",
auditorium: "Screen 3",
startsAt: new Date(Date.now() + 1000 * 60 * 210).toISOString(),
},
];


// 좌석: A~F, 1~10 → 각 상영에 대해 예약 상태를 별도로 관리
const ROWS = ["A", "B", "C", "D", "E", "F"];
const COLS = 10;


// showtimeId → 예약된 좌석 Set
const reservedMap: Record<string, Set<string>> = Object.fromEntries(
showtimes.map((s) => [s.id, new Set<string>(s.id === "s1" ? ["B5", "B6", "C3"] : [])])
);


function buildSeatGrid(showtimeId: string): Seat[] {
const reserved = reservedMap[showtimeId] ?? new Set<string>();
const seats: Seat[] = [];
for (const row of ROWS) {
for (let n = 1; n <= COLS; n++) {
const id = `${row}${n}`;
seats.push({ id, row, number: n, reserved: reserved.has(id) });
}
}
return seats;
}

export const handlers = [
// 상영 목록
http.get("*/api/showtimes", () => {
return HttpResponse.json(showtimes);
}),


// 좌석 조회: /api/seats?showtimeId=s1
http.get("*/api/seats", ({ request }) => {
const url = new URL(request.url);
const showtimeId = url.searchParams.get("showtimeId");
if (!showtimeId || !showtimes.find((s) => s.id === showtimeId)) {
return HttpResponse.json({ message: "Invalid showtimeId" }, { status: 400 });
}
const seats = buildSeatGrid(showtimeId);
return HttpResponse.json({ showtimeId, seats });
}),


// 예약: { showtimeId, seats: ["A1", "A2"] }
http.post("*/api/reserve", async ({ request }) => {
const body = (await request.json()) as { showtimeId?: string; seats?: string[] };
const showtimeId = body?.showtimeId;
const seats = body?.seats ?? [];


if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
return HttpResponse.json({ message: "showtimeId and seats are required" }, { status: 400 });
}
if (!showtimes.find((s) => s.id === showtimeId)) {
return HttpResponse.json({ message: "Invalid showtimeId" }, { status: 400 });
}


const reserved = reservedMap[showtimeId] ?? new Set<string>();


// 충돌 검사
const conflicts = seats.filter((id) => reserved.has(id));
if (conflicts.length > 0) {
return HttpResponse.json(
{ message: "Some seats are already reserved", conflicts },
{ status: 409 }
);
}


// 예약 반영
seats.forEach((id) => reserved.add(id));
reservedMap[showtimeId] = reserved;


// 간단한 예매코드 생성
const code = `BK-${showtimeId}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
return HttpResponse.json({ ok: true, code }, { status: 201 });
}),
];