import {useEffect, useState} from 'react';
import {requestLocationPermission} from '../../../services/locationPermission';
import BackgroundGeolocation, {
  Location as BGLocation,
} from 'react-native-background-geolocation';
import {locationService} from './locationService';
import {Location} from './schema';

// 📡 백그라운드 위치 추적 커스텀 훅
export const useBackgroundLocation = (
  userId: string,
  role: 'host' | 'shared',
  hostUserId?: string,
) => {
  const [locations, setLocations] = useState<Record<string, Location>>({}); // ✅ 여러 사용자 위치 저장
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeLocationTracking = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      // ✅ 웹소켓 연결 (호스트 & 공유자 모두 연결)
      locationService.connect(userId, role, hostUserId);

      // ✅ 위치 업데이트 구독
      locationService.subscribeToLocationUpdates((updatedLocations) => {
        setLocations({...updatedLocations});
      });

      // ✅ Background Geolocation 설정
      BackgroundGeolocation.ready(
        {
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
          distanceFilter: 5, // 5m 이동 시 업데이트
          stopOnTerminate: false, // 앱 종료 시에도 백그라운드에서 실행
          startOnBoot: true, // 기기 재부팅 후에도 실행
          foregroundService: true, // 포그라운드 서비스 활성화
          enableHeadless: true, // 앱이 종료된 상태에서도 위치 추적
          notification: {
            title: '위치 추적 중',
            text: '위치가 지속적으로 추적됩니다.',
          },
        },
        (state) => {
          if (!state.enabled) {
            BackgroundGeolocation.start(); // ✅ 위치 추적 시작
          }
        },
      );

      // ✅ 현재 위치 가져오기
      BackgroundGeolocation.getCurrentPosition(
        {
          timeout: 30,
          maximumAge: 0,
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        },
        (position: BGLocation) => {
          const newLocation: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
          };

          console.log('아아아아아아아제바아아아알: ', newLocation);

          locationService.sendLocation(newLocation);

          setLocations((prev) => ({
            ...prev,
            [userId]: newLocation, // 내 위치 저장
          }));

          setLoading(false);
        },
        (error) => {
          console.error('⚠️ 위치 가져오기 실패:', error);
          setLoading(false);
        },
      );

      let lastLocation: Location | null = null; // ✅ 마지막 위치 저장

      // ✅ 실시간 위치 추적
      BackgroundGeolocation.onLocation((location: BGLocation) => {
        console.log('📍 위치 업데이트 감지!!!!'); // 로그 추가

        const newLocation: Location = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: Date.now(),
        };

        // ✅ 동일한 위치이면 무시
        if (
          lastLocation &&
          lastLocation.latitude === newLocation.latitude &&
          lastLocation.longitude === newLocation.longitude
        ) {
          console.log('⚠️ 동일한 위치 감지됨 → 무시');
          return;
        }

        lastLocation = newLocation; // ✅ 마지막 위치 업데이트

        setLocations((prev) => ({
          ...prev,
          [userId]: newLocation, // 내 위치 업데이트
        }));

        locationService.sendLocation(newLocation);
      });
    };

    initializeLocationTracking();

    return () => {
      BackgroundGeolocation.removeListeners();
      BackgroundGeolocation.stop();
      locationService.disconnect();
      console.log('🚀 위치 추적 종료');
    };
  }, [userId, role, hostUserId]);

  return {locations, loading};
};
