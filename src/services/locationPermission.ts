import {PermissionsAndroid, Platform} from 'react-native';

// 🛠 위치 권한 요청 함수 (백그라운드 위치 권한 추가)
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      // ✅ 1. 포그라운드 위치 권한 요청 (ACCESS_FINE_LOCATION)
      const fineLocationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (fineLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('🚨 ACCESS_FINE_LOCATION 권한이 거부됨');
        return false;
      }

      console.log('✅ 포그라운드 위치 권한 허용됨');

      // ✅ 2. Android 10(API 29) 이상에서는 백그라운드 위치 권한 추가 요청
      if (Platform.Version >= 29) {
        const backgroundLocationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );

        if (backgroundLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('🚨 ACCESS_BACKGROUND_LOCATION 권한이 거부됨');
          return false;
        }

        console.log('✅ 백그라운드 위치 권한 허용됨');
      }

      return true;
    } catch (err) {
      console.error('🚨 위치 권한 요청 실패:', err);
      return false;
    }
  }
  return true;
};
