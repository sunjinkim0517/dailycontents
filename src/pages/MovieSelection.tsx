import { useState } from "react";
import Showtimes from "./Showtimes";

type Movie = {
  id: string;
  title: string;
  poster: string;
  genre: string;
  duration: string;
  rating: string;
  director: string;
  description: string;
};

// API 요청 없이 정적 데이터 사용
const MOVIES: Movie[] = [
  {
    id: "m1",
    title: "Interstellar",
    poster: "🌌",
    genre: "SF / 드라마",
    duration: "169분",
    rating: "12세 관람가",
    director: "크리스토퍼 놀란",
    description: "지구의 미래를 위해 우주로 떠나는 탐험가들의 이야기"
  },
  {
    id: "m2",
    title: "Inside Out 2",
    poster: "😊",
    genre: "애니메이션 / 코미디",
    duration: "96분",
    rating: "전체 관람가",
    director: "켈시 만",
    description: "라일리의 새로운 감정들과 함께하는 성장 이야기"
  },
  {
    id: "m3",
    title: "Dune: Part Two",
    poster: "🏜️",
    genre: "SF / 액션",
    duration: "166분",
    rating: "12세 관람가",
    director: "드니 빌뇌브",
    description: "폴 아트레이데스의 운명적인 여정이 계속된다"
  },
  {
    id: "m4",
    title: "Oppenheimer",
    poster: "☢️",
    genre: "드라마 / 역사",
    duration: "180분",
    rating: "15세 관람가",
    director: "크리스토퍼 놀란",
    description: "원자폭탄의 아버지, 로버트 오펜하이머의 이야기"
  },
  {
    id: "m5",
    title: "The Batman",
    poster: "🦇",
    genre: "액션 / 범죄",
    duration: "176분",
    rating: "15세 관람가",
    director: "맷 리브스",
    description: "고담시의 어둠 속에서 정의를 추구하는 배트맨"
  },
  {
    id: "m6",
    title: "Spider-Man: Across the Spider-Verse",
    poster: "🕷️",
    genre: "애니메이션 / 액션",
    duration: "140분",
    rating: "전체 관람가",
    director: "호아킨 도스 산토스",
    description: "멀티버스를 넘나드는 스파이더맨들의 모험"
  }
];

export default function MovieSelection() {
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [hoveredMovie, setHoveredMovie] = useState<string | null>(null);

  // 영화를 선택하면 Showtimes 페이지로 전환
  if (selectedMovie) {
    return <Showtimes movieId={selectedMovie} onBack={() => setSelectedMovie(null)} />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px"
    }}>
      <div style={{
        maxWidth: "1600px",
        margin: "0 auto"
      }}>
        {/* 헤더 */}
        <header style={{
          textAlign: "center",
          marginBottom: "60px",
          color: "white"
        }}>
          <h1 style={{
            fontSize: "4.5em",
            marginBottom: "20px",
            textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
            fontWeight: "bold"
          }}>
            🎬 CGV 영화 예매
          </h1>
          <p style={{
            fontSize: "1.5em",
            opacity: 0.9
          }}>
            현재 상영중인 영화를 선택해주세요
          </p>
        </header>

        {/* 영화 그리드 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "40px",
          padding: "30px"
        }}>
          {MOVIES.map((movie) => (
            <div
              key={movie.id}
              onClick={() => setSelectedMovie(movie.id)}
              onMouseEnter={() => setHoveredMovie(movie.id)}
              onMouseLeave={() => setHoveredMovie(null)}
              style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: hoveredMovie === movie.id ? "translateY(-5px) scale(1.02)" : "none",
                boxShadow: hoveredMovie === movie.id
                  ? "0 20px 40px rgba(0,0,0,0.3)"
                  : "0 5px 15px rgba(0,0,0,0.2)"
              }}
            >
              {/* 영화 포스터 영역 */}
              <div style={{
                height: "320px",
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "8em",
                position: "relative",
                overflow: "hidden"
              }}>
                {/* 배경 애니메이션 효과 */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                  transform: hoveredMovie === movie.id ? "scale(1.5)" : "scale(1)",
                  transition: "transform 0.5s ease"
                }} />
                <span style={{
                  position: "relative",
                  filter: hoveredMovie === movie.id ? "drop-shadow(0 0 20px rgba(255,255,255,0.5))" : "none",
                  transition: "filter 0.3s ease"
                }}>
                  {movie.poster}
                </span>
              </div>

              {/* 영화 정보 */}
              <div style={{
                padding: "30px"
              }}>
                <h3 style={{
                  fontSize: "2em",
                  marginBottom: "15px",
                  color: "#333",
                  fontWeight: "bold"
                }}>
                  {movie.title}
                </h3>
                
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "20px"
                }}>
                  <span style={{
                    background: "#f3f4f6",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "1em",
                    color: "#666"
                  }}>
                    {movie.genre}
                  </span>
                  <span style={{
                    background: "#f3f4f6",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "1em",
                    color: "#666"
                  }}>
                    {movie.duration}
                  </span>
                  <span style={{
                    background: "#fef3c7",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "1em",
                    color: "#92400e",
                    fontWeight: "bold"
                  }}>
                    {movie.rating}
                  </span>
                </div>

                <p style={{
                  fontSize: "1.1em",
                  color: "#666",
                  lineHeight: "1.6",
                  marginBottom: "15px",
                  minHeight: "50px"
                }}>
                  {movie.description}
                </p>

                <p style={{
                  fontSize: "1em",
                  color: "#999",
                  marginBottom: "20px"
                }}>
                  감독: {movie.director}
                </p>

                {/* 선택 버튼 */}
                <div style={{
                  marginTop: "20px",
                  textAlign: "center"
                }}>
                  <button style={{
                    background: hoveredMovie === movie.id
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "#f3f4f6",
                    color: hoveredMovie === movie.id ? "white" : "#666",
                    border: "none",
                    padding: "15px 40px",
                    borderRadius: "30px",
                    fontSize: "1.2em",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    width: "100%",
                    boxShadow: hoveredMovie === movie.id 
                      ? "0 5px 15px rgba(102, 126, 234, 0.4)"
                      : "none"
                  }}>
                    상영 시간 선택 →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 안내 메시지 */}
        <div style={{
          textAlign: "center",
          marginTop: "60px",
          marginBottom: "40px",
          color: "white",
          opacity: 0.9
        }}>
          <p style={{ fontSize: "1.3em" }}>🎟️ 영화를 선택하시면 상영 시간표를 확인하실 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}