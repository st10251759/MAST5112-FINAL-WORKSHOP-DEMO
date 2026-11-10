import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadows, spacing, typography } from '../theme/theme';

interface StatTileProps {
  label: string;
  value: string;
  caption?: string;
  /** "onGradient" is the translucent version used inside the purple header. */
  tone?: 'card' | 'onGradient';
}

/** One headline number with a label. Values shrink to fit instead of wrapping or clipping. */
export function StatTile({ label, value, caption, tone = 'card' }: StatTileProps) {
  const onGradient = tone === 'onGradient';
  return (
    <View
      style={[styles.tile, onGradient ? styles.tileOnGradient : styles.tileCard]}
      accessible
      accessibilityLabel={`${label}: ${value}${caption ? `, ${caption}` : ''}`}
    >
      <Text style={[styles.label, onGradient ? styles.labelOnGradient : styles.labelCard]} numberOfLines={1}>
        {label}
      </Text>
      <Text
        style={[styles.value, onGradient ? styles.valueOnGradient : styles.valueCard]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value}
      </Text>
      {caption ? (
        <Text style={[styles.caption, onGradient ? styles.labelOnGradient : styles.labelCard]} numberOfLines={2}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: 2,
  },
  tileOnGradient: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  tileCard: {
    backgroundColor: colors.white,
    ...shadows.card,
  },
  label: {
    ...typography.small,
  },
  labelOnGradient: {
    color: colors.lavender,
  },
  labelCard: {
    color: colors.textSecondary,
  },
  value: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
  valueOnGradient: {
    color: colors.white,
  },
  valueCard: {
    color: colors.primaryDeep,
  },
  caption: {
    ...typography.small,
  },
});
