import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import SafeScreen from '@/src/components/global/templates/SafeScreen'; // 안전한 화면 래퍼
import imageIcon from '../../../assets/images/harp_seal.png';
import {useLocation} from '../../hooks/domain/location/useLocation'; // 위치 훅 불러오기
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/src/navigation/types';
import {Paths} from '@/src/navigation/paths';
import {locationService} from '../../hooks/domain/location/locationService'; // ✅ 위치 공유 중단을 위해 추가
import BackPressHandler from '../../components/global/BackPressHandler';
import {useBackgroundLocation} from '../../hooks/domain/location/useBackgroundLocation';

// ✅ 타입 정의
type MapScreenProps = NativeStackScreenProps<RootStackParamList, Paths.Map>;

export default function Map({route, navigation}: MapScreenProps) {
  const {userId, role, hostUserId} = route.params; // 네비게이션에서 받은 props
  const {locations, loading} = useLocation(userId, role, hostUserId);

  // // ✅ 백그라운드에서도 위치 공유 유지
  // useBackgroundLocation(userId, role);

  // ✅ "뒤로 가기" 버튼을 눌렀을 때 실행될 함수
  const handleBackPress = () => {
    Alert.alert(
      '위치 공유 종료',
      '위치 공유를 그만하시겠습니까?',
      [
        {text: '아니요', onPress: () => null, style: 'cancel'},
        {
          text: '예',
          onPress: () => {
            locationService.disconnect(); // ✅ 위치 공유 종료
            navigation.goBack(); // ✅ 뒤로 가기
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    // <SafeScreen>

    // </SafeScreen>
    <View style={styles.container}>
      {/* ✅ "뒤로 가기" 감지하는 컴포넌트 추가 */}
      <BackPressHandler onBackPress={handleBackPress} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>위치를 가져오는 중...</Text>
        </View>
      ) : Object.keys(locations).length > 0 ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: locations[userId]?.latitude || 37.5665,
            longitude: locations[userId]?.longitude || 126.978,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true}
          followsUserLocation={true}>
          {/* ✅ 모든 사용자의 위치를 지도에 마커로 표시 */}
          {Object.entries(locations).map(([id, loc]) => (
            <Marker
              key={id}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
              title={id === userId ? '나' : `사용자 ${id}`}
              description={
                id === userId ? '내 현재 위치' : `사용자 ${id}의 위치`
              }
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.center}>
          <Text style={styles.errorText}>위치를 가져올 수 없습니다.</Text>
        </View>
      )}
    </View>
  );
}

// ✅ 스타일 적용
const styles = StyleSheet.create({
  container: {flex: 1},
  map: {flex: 1},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  loadingText: {marginTop: 10, fontSize: 16, color: 'black'},
  errorText: {fontSize: 16, color: 'red'},
  markerContainer: {
    width: 38, // 전체 크기 조절
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // 배경색 (테두리 효과)
    borderRadius: 25, // 원형 테두리
    borderWidth: 3, // 테두리 두께
    borderColor: 'black', // 테두리 색상
  },
  markerImage: {
    width: 35, // 원하는 크기로 조정
    height: 35,
    resizeMode: 'contain',
  },
});
