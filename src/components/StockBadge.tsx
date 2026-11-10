import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COMPACT_FONT_SCALE, colors, radii, spacing, typography } from '../theme/theme';
import type { StockStatus } from '../types/equipment';

interface StockBadgeProps {
  status: StockStatus;
  /** Quantity is included in the low-stock text, for example "Low stock: 2 left". */
  quantity: number;
}

/**
 * Gym enhancement. Renders nothing when stock is fine.
 * Warning states use an icon plus wording, so they never rely on colour alone.
 */
export function StockBadge({ status, quantity }: StockBadgeProps) {
  if (status === 'ok') return null;

  const isOut = status === 'out';
  const foreground = isOut ? colors.error : colors.amber;
  const surface = isOut ? colors.errorSurface : colors.amberSurface;
  const text = isOut ? 'Out of stock' : `Low stock: ${quantity} left`;

  return (
    <View style={[styles.badge, { backgroundColor: surface }]}>
      <Ionicons name={isOut ? 'close-circle' : 'alert-circle'} size={14} color={foreground} />
      <Text style={[styles.text, { color: foreground }]} maxFontSizeMultiplier={COMPACT_FONT_SCALE}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.label,
  },
});
