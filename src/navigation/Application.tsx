import { Paths } from "@/src/navigation/paths";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {Home} from "@/src/screens";

const Stack = createNativeStackNavigator();

export default function ApplicationNavigator() {
  return (
    <SafeAreaProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="home" screenOptions={{ headerShown: false }}>
                <Stack.Screen name={Paths.Home} component={Home} />
            </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>
  )
}
