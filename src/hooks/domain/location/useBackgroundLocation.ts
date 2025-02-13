import {useEffect} from 'react';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {locationService} from './locationService';
import {Location} from './schema';

export const useBackgroundLocation = (
  userId: string,
  role: 'host' | 'shared',
) => {
  useEffect(() => {
    if (role !== 'host') return; // ✅ 공유자는 위치를 보낼 필요 없음

    // 🌍 백그라운드 위치 추적 설정
    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH, // 높은 정확도
      distanceFilter: 5, // 최소 5m 이동할 때 업데이트
      stopOnTerminate: false, // 앱이 종료되어도 위치 추적 유지
      startOnBoot: true, // 기기가 부팅될 때 자동 시작
      enableHeadless: true, // 앱이 실행되지 않아도 위치 업데이트 가능
      allowIdenticalLocations: false, // 동일한 위치는 무시
      debug: false, // 디버깅용 로그 (필요시 true)
      logLevel: BackgroundGeolocation.LOG_LEVEL_OFF,
    }).then((state) => {
      if (!state.enabled) {
        BackgroundGeolocation.start(); // ✅ 백그라운드 위치 추적 시작
      }
    });

    // 🌍 위치 변경 이벤트 리스너
    BackgroundGeolocation.onLocation((location) => {
      const newLocation: Location = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: Date.now(),
      };

      console.log('📡 백그라운드 위치 전송: ', newLocation);
      locationService.sendLocation(newLocation); // ✅ 서버로 위치 전송
    });

    return () => {
      BackgroundGeolocation.removeListeners(); // ✅ 리스너 정리
    };
  }, [userId, role]);
};
