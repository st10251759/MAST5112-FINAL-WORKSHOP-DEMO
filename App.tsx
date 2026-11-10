import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoadingScreen } from './src/components/LoadingScreen';
import { NoticeBanner } from './src/components/NoticeBanner';
import { InventoryProvider, useInventory } from './src/context/InventoryContext';
import { RootNavigator } from './src/navigation/RootNavigator';

/**
 * The app waits for saved data to finish loading (isHydrated) before showing any screen,
 * so the empty initial state never flashes and can never be saved over real records.
 */
function AppShell() {
  const { isHydrated } = useInventory();
  return (
    <>
      <StatusBar style="light" />
      {isHydrated ? <RootNavigator /> : <LoadingScreen />}
      <NoticeBanner />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <InventoryProvider>
        <AppShell />
      </InventoryProvider>
    </SafeAreaProvider>
  );
}
