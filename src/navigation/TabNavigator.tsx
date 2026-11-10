// ============================================================
// Code Attribution
// Usage: Implemented using the documented createBottomTabNavigator API with typed
//        screen props. Tab icons and styling are original AI-assisted code.
// Author: React Navigation contributors
// Link: https://reactnavigation.org/docs/getting-started
// Date Accessed: 10 November 2026
// Date Published: Not stated
// Version: React Navigation 7.x
// ============================================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { InventoryScreen } from '../screens/InventoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StatisticsScreen } from '../screens/StatisticsScreen';
import { colors } from '../theme/theme';
import type { TabParamList } from '../types/navigation';
import type { IconName } from '../types/ui';

const Tab = createBottomTabNavigator<TabParamList>();

// Filled icon when the tab is selected, outline when it is not (shape + colour).
const TAB_ICONS: Record<keyof TabParamList, { active: IconName; inactive: IconName }> = {
  Inventory: { active: 'list', inactive: 'list-outline' },
  Statistics: { active: 'stats-chart', inactive: 'stats-chart-outline' },
  Settings: { active: 'settings', inactive: 'settings-outline' },
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.border },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? TAB_ICONS[route.name].active : TAB_ICONS[route.name].inactive}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
