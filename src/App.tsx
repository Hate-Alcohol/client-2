import * as React from 'react';
import { MMKV } from "react-native-mmkv";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ApplicationNavigator from "@/src/navigation/Application";

export const storage = new MMKV();

export default function App() {
  return (
    <GestureHandlerRootView>
        <ApplicationNavigator />
    </GestureHandlerRootView>
  );
}
