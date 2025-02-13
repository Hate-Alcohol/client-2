import {PermissionsAndroid, Platform} from 'react-native';

// 🛠 위치 권한 요청 함수
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('🚨 ACCESS_FINE_LOCATION 권한이 거부됨');
        return false;
      }

      console.log('✅ 위치 권한 허용됨');
      return true;
    } catch (err) {
      console.error('🚨 위치 권한 요청 실패:', err);
      return false;
    }
  }
  return true;
};
