import {useEffect, useState} from 'react';
import {requestLocationPermission} from '../../../services/locationPermission';
import Geolocation from '@react-native-community/geolocation';
import {locationService} from './locationService';
import {Location} from './schema';

// 📡 위치 추적 커스텀 훅
export const useLocation = (
  userId: string,
  role: 'host' | 'shared',
  hostUserId?: string,
) => {
  const [locations, setLocations] = useState<Record<string, Location>>({}); // ✅ 여러 사용자 위치 저장
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let watchId: number | null = null;

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

      // ✅ 현재 위치 가져오기 (호스트 & 공유자 모두)
      Geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
          };

          setLocations((prev) => ({
            ...prev,
            [userId]: newLocation, // 내 위치 저장
          }));

          setLoading(false);
        },
        (error) => {
          console.error('⚠️ 위치 가져오기 실패:', error.code, error.message);
          setLoading(false);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 0},
      );

      // ✅ 실시간 위치 추적
      watchId = Geolocation.watchPosition(
        (position) => {
          const newLocation: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
          };

          setLocations((prev) => ({
            ...prev,
            [userId]: newLocation, // 호스트(A)의 위치 업데이트
          }));

          locationService.sendLocation(newLocation);
        },
        (error) => {
          console.error(
            '⚠️ 실시간 위치 업데이트 실패:',
            error.code,
            error.message,
          );
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 5, // 5m 이동하면 위치 업데이트
          timeout: 20000,
          maximumAge: 10000,
        },
      );
    };

    initializeLocationTracking();

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
        console.log('🚀 위치 추적 종료');
      }
      locationService.disconnect();
    };
  }, [userId, role, hostUserId]);

  return {locations, loading};
};
