import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COMPACT_FONT_SCALE, radii, spacing, typography } from '../theme/theme';
import type { Category } from '../types/equipment';
import { CATEGORY_STYLE } from './categoryStyle';

/** Pill showing the category as icon + text (never colour alone). */
export function CategoryBadge({ category }: { category: Category }) {
  const style = CATEGORY_STYLE[category];
  return (
    <View style={[styles.badge, { backgroundColor: style.surface }]}>
      <Ionicons name={style.icon} size={14} color={style.foreground} />
      <Text
        style={[styles.text, { color: style.foreground }]}
        maxFontSizeMultiplier={COMPACT_FONT_SCALE}
      >
        {category}
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
