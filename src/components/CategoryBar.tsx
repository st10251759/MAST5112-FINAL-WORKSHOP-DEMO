import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/theme';
import type { Category } from '../types/equipment';
import { CATEGORY_STYLE } from './categoryStyle';

interface CategoryBarProps {
  category: Category;
  count: number;
  /** The whole the bar is measured against, so the bar is count out of total. */
  total: number;
  /** What is being counted, so records, units and rand are never confused. */
  unit: 'records' | 'units';
}

/**
 * Simple bar made from plain Views.
 * Honest scale: the full track always means the TOTAL (all records, or all units), and the
 * exact count is written next to it. There is no rescaling to the biggest bar.
 */
export function CategoryBar({ category, count, total, unit }: CategoryBarProps) {
  const style = CATEGORY_STYLE[category];
  const fraction = total > 0 ? Math.min(1, count / total) : 0;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={`${category}: ${count} of ${total} ${unit}`}
    >
      <View style={styles.row}>
        <View style={styles.labelRow}>
          <Ionicons name={style.icon} size={18} color={style.foreground} />
          <Text style={styles.label}>{category}</Text>
        </View>
        <Text style={styles.count}>
          {count} {unit === 'records' ? (count === 1 ? 'record' : 'records') : count === 1 ? 'unit' : 'units'}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${fraction * 100}%`, backgroundColor: style.foreground }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  count: {
    ...typography.bodyStrong,
    color: colors.primaryDeep,
  },
  track: {
    height: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.lavender,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
  },
});
