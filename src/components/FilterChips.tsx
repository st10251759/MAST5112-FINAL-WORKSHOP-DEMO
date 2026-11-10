import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COMPACT_FONT_SCALE, colors, radii, spacing, typography } from '../theme/theme';
import { CATEGORIES } from '../types/equipment';
import type { Category, CategoryFilter } from '../types/equipment';

interface FilterChipsProps {
  selected: CategoryFilter;
  onSelect: (category: CategoryFilter) => void;
  /** Records per category across ALL inventory (not the filtered list). */
  totalRecords: number;
  recordsByCategory: Record<Category, number>;
  favouritesOnly: boolean;
  favouriteCount: number;
  onToggleFavourites: () => void;
}

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: 'heart';
}

function Chip({ label, selected, onPress, icon }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      hitSlop={4}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}
    >
      {/* A tick on the selected chip means selection is not shown by colour alone. */}
      {selected ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
      {icon && !selected ? <Ionicons name="heart-outline" size={16} color={colors.primaryDeep} /> : null}
      <Text
        style={[styles.chipText, selected && styles.chipTextSelected]}
        maxFontSizeMultiplier={COMPACT_FONT_SCALE}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** Category chips (All / Cardio / Strength / Accessories) plus a favourites-only chip. */
export function FilterChips({
  selected,
  onSelect,
  totalRecords,
  recordsByCategory,
  favouritesOnly,
  favouriteCount,
  onToggleFavourites,
}: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.row}
    >
      <Chip label={`All ${totalRecords}`} selected={selected === 'All'} onPress={() => onSelect('All')} />
      {CATEGORIES.map((category) => (
        <Chip
          key={category}
          label={`${category} ${recordsByCategory[category]}`}
          selected={selected === category}
          onPress={() => onSelect(category)}
        />
      ))}
      <Chip
        label={`Favourites ${favouriteCount}`}
        icon="heart"
        selected={favouritesOnly}
        onPress={onToggleFavourites}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  chipText: {
    ...typography.smallStrong,
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.white,
  },
});
