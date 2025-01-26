import { Paths } from "@/src/navigation/paths";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function ApplicationNavigator() {
  return (
    <SafeAreaProvider>
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={Paths.Home} component={} />
            </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>
  )
}
