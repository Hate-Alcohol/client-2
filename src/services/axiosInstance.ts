import axios from 'axios';
import {Alert} from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 아래 설정은 나중에!
// 요청 인터셉터 설정
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // 인증 토큰 추가 (예: AsyncStorage에서 토큰 가져오기)
//     const token = 'your-auth-token'; // 필요 시 동적으로 설정
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     // 요청 에러 처리
//     return Promise.reject(error);
//   },
// );

// 응답 인터셉터 설정 (공통 에러 처리)
// axiosInstance.interceptors.response.use(
//     (response) => {
//       // 응답 데이터 그대로 반환
//       return response;
//     },
//     (error) => {
//       // 공통 에러 처리 (예: 인증 만료, 네트워크 오류)
//       if (error.response?.status === 401) {
//         Alert.alert('Unauthorized', 'Please log in again.');
//         // 로그아웃 처리 로직 추가 가능
//       } else if (error.message === 'Network Error') {
//         Alert.alert('Network Error', 'Please check your internet connection.');
//       } else if (error.code === 'ECONNABORTED') {
//         Alert.alert('Request Timeout', 'The request took too long. Please try again.');
//       }
//       return Promise.reject(error);
//     }
//   );
