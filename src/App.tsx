import * as React from 'react';
import {MMKV} from 'react-native-mmkv';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ApplicationNavigator from '@/src/navigation/Application';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

export const storage = new MMKV();

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <ApplicationNavigator />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
