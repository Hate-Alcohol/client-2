import {Paths} from '@/src/navigation/paths';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home, Example} from '@/src/screens';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function ApplicationNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={Paths.Home}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name={Paths.Home} component={Home} />
          <Stack.Screen name={Paths.Example} component={Example} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
