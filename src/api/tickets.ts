import axios from 'axios';
import type { Showtime, Seat } from "../mocks/handlers";

// 환경변수에서 BASE_URL 가져오기 (없으면 기본값 사용)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? "http://localhost:8080" : window.location.origin);

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// console.log('[API] Base URL:', API_BASE_URL);
// console.log('[API] MSW 상태:', import.meta.env.VITE_USE_MSW);

// 요청 인터셉터 (토큰 등 추가 가능)
axiosInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 처리)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 서버가 응답을 반환한 경우
      switch (error.response.status) {
        case 401:
          console.error('인증 오류: 로그인이 필요합니다');
          // window.location.href = '/login';
          break;
        case 404:
          console.error('요청한 리소스를 찾을 수 없습니다');
          break;
        case 500:
          console.error('서버 오류가 발생했습니다');
          break;
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('서버에 연결할 수 없습니다:', error.message);
    }
    return Promise.reject(error);
  }
);

// ------------------------------------------------------------------

export async function getShowtimes(): Promise<Showtime[]> {
  const { data } = await axiosInstance.get<Showtime[]>('/api/showtimes');
  return data;
}

export async function getSeats(
  showtimeId: string
): Promise<{ showtimeId: string; seats: Seat[] }> {
  const { data } = await axiosInstance.get('/api/seats', {
    params: { showtimeId }
  });
  return data;
}

export async function reserveSeats(
  showtimeId: string,
  seats: string[]
): Promise<{ ok: boolean; code: string }> {
  try {
    const { data } = await axiosInstance.post('/api/reserve', {
      showtimeId,
      seats
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error(`이미 예약된 좌석: ${error.response.data.conflicts?.join(", ")}`);
    }
    throw error;
  }
}