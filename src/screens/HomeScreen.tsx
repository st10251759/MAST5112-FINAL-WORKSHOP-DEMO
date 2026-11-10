// ============================================================
// Code Attribution
// Usage: Home screen built with the documented React Native ImageBackground, Pressable and
//        StyleSheet APIs and expo-linear-gradient for the dark purple overlay. The layout and
//        wording are original AI-assisted code written for this project.
// Author: Meta Platforms / React Native contributors; Expo contributors
// Link: https://reactnative.dev/docs/imagebackground
// Date Accessed: Not consulted in this session; add your own access date
// Date Published: Not stated
// Version: React Native 0.88
// ============================================================

import React, { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInventory } from '../context/InventoryContext';
import { IMAGE_ASSETS } from '../data/images';
import { colors, layout, radii, spacing, typography } from '../theme/theme';
import type { RootStackScreenProps } from '../types/navigation';
import type { IconName } from '../types/ui';

interface MenuItem {
  label: string;
  hint: string;
  icon: IconName;
  onPress: () => void;
}

/**
 * Landing screen: a gym photo behind a purple overlay, a title and four menu buttons.
 * If the photo cannot load, the gradient alone is shown, so the screen is never blank.
 */
export function HomeScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const insets = useSafeAreaInsets();
  const { equipment } = useInventory();
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  const items: MenuItem[] = [
    {
      label: 'View Inventory',
      hint: 'Browse, search and filter all equipment',
      icon: 'list',
      onPress: () => navigation.navigate('Tabs', { screen: 'Inventory' }),
    },
    {
      label: 'Add Equipment',
      hint: 'Create a new equipment record',
      icon: 'add-circle',
      onPress: () => navigation.navigate('EquipmentForm'),
    },
    {
      label: 'Statistics',
      hint: 'Totals, average price and category counts',
      icon: 'stats-chart',
      onPress: () => navigation.navigate('Tabs', { screen: 'Statistics' }),
    },
    {
      label: 'Settings',
      hint: 'Stock threshold and demo data',
      icon: 'settings',
      onPress: () => navigation.navigate('Tabs', { screen: 'Settings' }),
    },
  ];

  return (
    <ImageBackground
      source={imageFailed ? undefined : { uri: IMAGE_ASSETS.homeBackground }}
      resizeMode="cover"
      onError={() => setImageFailed(true)}
      style={styles.background}
      accessibilityIgnoresInvertColors
    >
      <LinearGradient
        colors={['rgba(46,16,101,0.62)', 'rgba(46,16,101,0.90)']}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
            Campus gym
          </Text>
          <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={1.3}>
            CampusFit Inventory
          </Text>
          <Text style={styles.subtitle} maxFontSizeMultiplier={1.3}>
            {equipment.length} {equipment.length === 1 ? 'item' : 'items'} tracked
          </Text>
        </View>

        <View style={styles.menu}>
          {items.map((item: MenuItem) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityHint={item.hint}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >
              <Ionicons name={item.icon} size={24} color={colors.primary} />
              <Text style={styles.buttonLabel} maxFontSizeMultiplier={1.3}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: colors.primaryDeep },
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    justifyContent: 'space-between',
  },
  hero: { gap: spacing.xxs },
  eyebrow: { ...typography.label, color: colors.lavender, letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontSize: 34, lineHeight: 40, fontWeight: '700', color: colors.white },
  subtitle: { ...typography.body, color: colors.lavender },
  menu: { gap: spacing.xs },
  button: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  buttonPressed: { backgroundColor: colors.lavender },
  buttonLabel: { ...typography.bodyStrong, color: colors.primaryDeep, flex: 1 },
});
