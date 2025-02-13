import {Button, Text, View} from 'react-native';
import SafeScreen from '@/src/components/global/templates/SafeScreen';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/src/navigation/types';
import {Paths} from '@/src/navigation/paths';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, Paths.Home>;

export default function Home() {
  const nav = useNavigation<NavigationProp>(); // 타입 지정

  return (
    <SafeScreen>
      <View>
        <Text>Home</Text>
        <Button
          title="Go to Example"
          onPress={() => nav.navigate(Paths.Example)} // 타입 검증됨
        />
        {/* ✅ 이전에 추가했던 부분: "Go to Map" 버튼 */}
        <Button
          title="Go to Map"
          onPress={() =>
            nav.navigate(Paths.Map, {
              userId: 'exampleUserId',
              role: 'host',
              hostUserId: undefined,
            })
          }
        />
      </View>
    </SafeScreen>
  );
}
