import { useEffect, useMemo, useState } from "react";
import { getSeats, getShowtimes, reserveSeats } from "../api/tickets";
import SeatGrid from "../components/SeatGrid";
import type { Showtime, Seat } from "../mocks/handlers";


interface ShowtimesProps {
  movieId?: string;
  onBack?: () => void;
}

export default function Showtimes({ movieId, onBack }: ShowtimesProps = {}) {
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
const [showtimes, setShowtimes] = useState<Showtime[]>([]);
const [currentId, setCurrentId] = useState<string | null>(null);
const [seats, setSeats] = useState<Seat[]>([]);
const [selected, setSelected] = useState<Set<string>>(new Set());
const current = useMemo(
() => showtimes.find((s) => s.id === currentId),
[showtimes, currentId]
);


useEffect(() => {
(async () => {
try {
const list = await getShowtimes();
setShowtimes(list);
setCurrentId(list[0]?.id ?? null);
} catch (e: unknown) {
setError(e instanceof Error ? e.message : String(e));
} finally {
setLoading(false);
}
})();
}, []);useEffect(() => {
if (!currentId) return;
(async () => {
try {
const data = await getSeats(currentId);
setSeats(data.seats);
setSelected(new Set());
} catch (e: unknown) {
setError(e instanceof Error ? e.message : String(e));
}
})();
}, [currentId]);


if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
if (error) return <div style={{ padding: 24, color: "crimson" }}>Error: {error}</div>;


return (
<div style={{ 
  maxWidth: 1400, 
  margin: "40px auto", 
  fontFamily: "system-ui, sans-serif",
  padding: "40px",
  background: "white",
  borderRadius: "20px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
}}>
  {onBack && (
    <button
      onClick={onBack}
      style={{
        marginBottom: 30,
        padding: "12px 24px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "1.1em",
        fontWeight: "bold",
        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
        transition: "transform 0.3s ease"
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      ← 영화 선택으로 돌아가기
    </button>
  )}
  <h1 style={{ fontSize: "2.5em", marginBottom: "30px", color: "#333" }}>🎟️ 상영 시간 선택</h1>


<div style={{ display: "flex", gap: 15, marginBottom: 30, flexWrap: "wrap" }}>
{showtimes.map((s) => (
<button
key={s.id}
onClick={() => setCurrentId(s.id)}
style={{
padding: "15px 25px",
borderRadius: 12,
border: "2px solid #ddd",
        fontSize: "1.1em",
        fontWeight: "500",
        transition: "all 0.3s ease",
background: s.id === currentId ? "#def" : "#fff",
}}
title={`${s.movie} / ${new Date(s.startsAt).toLocaleString()}`}
>
{s.movie} — {new Date(s.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
</button>
))}
</div>{current && (
<div style={{ 
  marginBottom: 30, 
  padding: "20px", 
  background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
  borderRadius: "15px"
}}>
<div style={{ fontSize: "1.4em", fontWeight: "bold", marginBottom: "8px" }}>
  {current.movie} / {current.auditorium}
</div>
<div style={{ fontSize: "1.1em", color: "#666" }}>
  {new Date(current.startsAt).toLocaleString()}
</div>
</div>
)}


<SeatGrid
seats={seats}
selected={selected}
onToggle={(id) => {
const next = new Set(selected);
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
next.has(id) ? next.delete(id) : next.add(id);
setSelected(next);
}}
/>


<div style={{ marginTop: 30, display: "flex", gap: 15 }}>
<button
onClick={async () => {
if (!currentId || selected.size === 0) return;
try {
const resp = await reserveSeats(currentId, Array.from(selected));
alert(`예매 성공! 코드: ${resp.code}`);
const data = await getSeats(currentId);
setSeats(data.seats);
setSelected(new Set());
} catch (e: unknown) {
alert(e instanceof Error ? e.message : String(e));
}
}}
style={{ 
        padding: "15px 35px", 
        borderRadius: 12, 
        border: "none",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
        fontSize: "1.2em",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
        transition: "transform 0.3s ease"
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
>
좌석 예매
</button>
<button 
      onClick={() => setSelected(new Set())}
      style={{
        padding: "15px 35px",
        borderRadius: 12,
        border: "2px solid #ddd",
        background: "white",
        color: "#666",
        fontSize: "1.2em",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f3f4f6";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "white";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >선택 초기화</button>
</div>
</div>
);
}