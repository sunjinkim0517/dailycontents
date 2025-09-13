import { useMemo } from "react";
import type { Seat } from "../mocks/handlers";

type Props = {
  seats: Seat[];
  selected: Set<string>;
  onToggle: (id: string) => void;
};

export default function SeatGrid({ seats, selected, onToggle }: Props) {
  const rows = useMemo(() => {
    const map = new Map<string, Seat[]>();
    for (const s of seats) {
      if (!map.has(s.row)) map.set(s.row, []);
      map.get(s.row)!.push(s);
    }
    for (const list of map.values()) list.sort((a, b) => a.number - b.number);
    return Array.from(map.entries()).sort();
  }, [seats]);

  return (
    <div style={{ 
      display: "grid", 
      gap: 15,
      padding: "40px",
      background: "#f9fafb",
      borderRadius: "15px",
      justifyContent: "center"
    }}>
      {/* 스크린 표시 */}
      <div style={{
        background: "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "1.4em",
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        letterSpacing: "2px"
      }}>
        SCREEN
      </div>
      
      {rows.map(([row, list]) => (
        <div key={row} style={{ 
          display: "flex", 
          gap: 15, 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <div style={{ 
            width: 50, 
            textAlign: "center", 
            fontSize: "1.3em",
            fontWeight: "bold",
            color: "#667eea" 
          }}>
            {row}
          </div>
          
          {list.map((s) => {
            const isSelected = selected.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => !s.reserved && onToggle(s.id)}
                disabled={s.reserved}
                title={s.id}
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: 10,
                  border: "2px solid #ddd",
                  fontSize: "1.2em",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  background: s.reserved 
                    ? "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)" 
                    : isSelected 
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                    : "white",
                  color: s.reserved ? "#9ca3af" : isSelected ? "white" : "#374151",
                  boxShadow: isSelected ? "0 4px 10px rgba(102, 126, 234, 0.3)" : "0 2px 5px rgba(0,0,0,0.1)",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                  cursor: s.reserved ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!s.reserved && !isSelected) {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!s.reserved && !isSelected) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                  }
                }}
              >
                {s.number}
              </button>
            );
          })}
        </div>
      ))}
      
      {/* 좌석 범례 */}
      <div style={{
        marginTop: "40px",
        display: "flex",
        gap: "40px",
        justifyContent: "center",
        padding: "25px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "35px",
            height: "35px",
            background: "white",
            border: "2px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}></div>
          <span style={{ fontSize: "1.1em", color: "#666" }}>선택 가능</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "35px",
            height: "35px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(102, 126, 234, 0.3)"
          }}></div>
          <span style={{ fontSize: "1.1em", color: "#666" }}>선택됨</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "35px",
            height: "35px",
            background: "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
            borderRadius: "8px"
          }}></div>
          <span style={{ fontSize: "1.1em", color: "#666" }}>예매 완료</span>
        </div>
      </div>
    </div>
  );
}