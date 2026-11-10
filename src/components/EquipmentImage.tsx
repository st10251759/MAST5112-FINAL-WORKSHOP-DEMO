import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/theme';
import type { Category } from '../types/equipment';
import { CATEGORY_STYLE } from './categoryStyle';

interface EquipmentImageProps {
  /** Empty string or undefined means there is no image. */
  uri: string;
  category: Category;
  /** Width divided by height. The box keeps this shape whether or not the image loads. */
  aspectRatio?: number;
  iconSize?: number;
  /** Show "No image available" under the fallback icon (used on larger images). */
  showFallbackLabel?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Remote photo with a graceful fallback.
 * The box has a fixed aspect ratio and a lavender background, so layout never jumps if the
 * network is slow or the address is wrong. On failure the category icon is shown instead.
 */
export function EquipmentImage({
  uri,
  category,
  aspectRatio = 1,
  iconSize = 32,
  showFallbackLabel = false,
  accessibilityLabel,
  style,
}: EquipmentImageProps) {
  // Remember WHICH address failed, so editing the URL automatically gives it a fresh try.
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const showImage = uri.length > 0 && failedUri !== uri;

  return (
    <View style={[styles.box, { aspectRatio }, style]}>
      {showImage ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessible
          accessibilityRole="image"
          accessibilityLabel={accessibilityLabel ?? 'Equipment photo'}
          onError={() => setFailedUri(uri)}
        />
      ) : (
        <View
          style={styles.fallback}
          accessible
          accessibilityRole="image"
          accessibilityLabel={`${category} equipment, no photo available`}
        >
          <Ionicons name={CATEGORY_STYLE[category].icon} size={iconSize} color={colors.primary} />
          {showFallbackLabel ? <Text style={styles.fallbackText}>No image available</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.lavender,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  fallbackText: {
    ...typography.small,
    color: colors.textOnTint,
  },
});
