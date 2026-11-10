// ============================================================
// Code Attribution
// Usage: Implemented using the documented React Native ImageBackground component (source,
//        resizeMode, onError) and the useSafeAreaInsets hook. The banner layout and overlay
//        are original AI-assisted code written for this project.
// Author: Meta Platforms, Inc. and React Native contributors; react-native-safe-area-context contributors
// Link: https://reactnative.dev/docs/imagebackground
// Date Accessed: Not consulted in this session; add your own access date
// Date Published: Not stated
// Version: React Native 0.88
// ============================================================

import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BANNER_IMAGES } from '../data/images';
import { colors, radii, spacing, typography } from '../theme/theme';
import { IconButton } from './IconButton';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Photo behind the title. Defaults to the inventory banner. */
  image?: string;
  /** When given, a back button is shown on the left. */
  onBack?: () => void;
  /** Optional control on the right of the title row. */
  right?: ReactNode;
  /** Extra content under the title, for example the statistics strip. */
  children?: ReactNode;
}

/**
 * Image banner with a flat dark purple overlay so the white title stays readable on any photo.
 * If the photo cannot load, the overlay colour alone is shown. Adds the status-bar height
 * itself so it works edge to edge.
 */
export function ScreenHeader({
  title,
  subtitle,
  image = BANNER_IMAGES.inventory,
  onBack,
  right,
  children,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const [failed, setFailed] = useState<boolean>(false);

  return (
    <ImageBackground
      source={failed ? undefined : { uri: image }}
      resizeMode="cover"
      onError={() => setFailed(true)}
      style={[styles.banner, { paddingTop: insets.top + spacing.sm }]}
      accessibilityIgnoresInvertColors
    >
      <View style={styles.overlay} pointerEvents="none" />
      <View style={styles.row}>
        {onBack ? (
          <IconButton
            icon="arrow-back"
            label="Go back"
            onPress={onBack}
            color={colors.white}
            backgroundColor="rgba(255,255,255,0.18)"
          />
        ) : null}
        <View style={styles.titleBlock}>
          <Text style={styles.title} accessibilityRole="header" numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primaryDeep,
    paddingHorizontal: 20,
    paddingBottom: spacing.md,
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: radii.lg,
    overflow: 'hidden',
    gap: spacing.sm,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(46,16,101,0.78)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    ...typography.display,
    color: colors.white,
  },
  subtitle: {
    ...typography.small,
    color: colors.lavender,
    marginTop: spacing.xxs,
  },
});
