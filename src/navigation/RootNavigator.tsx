// ============================================================
// Code Attribution
// Usage: Implemented using the documented NavigationContainer, DefaultTheme and
//        createNativeStackNavigator APIs, following the React Navigation getting-started
//        setup (react-native-screens and react-native-safe-area-context installed with
//        "npx expo install"). The typed route list and screen choices are original
//        AI-assisted code written for this project.
// Author: React Navigation contributors
// Link: https://reactnavigation.org/docs/getting-started
// Date Accessed: 10 November 2026
// Date Published: Not stated
// Version: React Navigation 7.x
// ============================================================

import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EquipmentDetailsScreen } from '../screens/EquipmentDetailsScreen';
import { EquipmentFormScreen } from '../screens/EquipmentFormScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { colors } from '../theme/theme';
import type { RootStackParamList } from '../types/navigation';
import { TabNavigator } from './TabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.white,
    text: colors.text,
    border: colors.border,
  },
};

/**
 * One typed stack on top of the tabs. Add/Edit and Details are pushed over the tab bar, so
 * their buttons can never be hidden behind it. Each screen draws its own image banner,
 * so the native header is turned off.
 */
export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="EquipmentForm" component={EquipmentFormScreen} />
        <Stack.Screen name="EquipmentDetails" component={EquipmentDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
