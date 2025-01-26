import { Text, View } from "react-native";
import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { MMKV } from "react-native-mmkv";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ApplicationNavigator from "./navigation/Application";

export const storage = new MMKV();

export default function App() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <ApplicationNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
