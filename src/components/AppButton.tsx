import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, layout, radii, spacing, typography } from '../theme/theme';
import type { IconName } from '../types/ui';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

const VARIANT_COLORS: Record<Variant, { background: string; text: string; border: string }> = {
  primary: { background: colors.primary, text: colors.white, border: colors.primary },
  secondary: { background: colors.white, text: colors.primaryDeep, border: colors.primary },
  danger: { background: colors.error, text: colors.white, border: colors.error },
  ghost: { background: 'transparent', text: colors.primaryDeep, border: 'transparent' },
};

/** One button component for the whole app: 52dp tall, clear pressed and disabled states. */
export function AppButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  accessibilityHint,
  style,
}: AppButtonProps) {
  const palette = VARIANT_COLORS[variant];
  const isDisabled = disabled || loading;
  const textColor = isDisabled && variant !== 'ghost' ? colors.disabledText : palette.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isDisabled && variant !== 'ghost' ? colors.disabledSurface : palette.background,
          borderColor: isDisabled && variant !== 'ghost' ? colors.disabledSurface : palette.border,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={20} color={textColor} /> : null}
          <Text style={[styles.label, { color: textColor }]} maxFontSizeMultiplier={1.4}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.buttonHeight,
    borderRadius: radii.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  label: {
    ...typography.bodyStrong,
    textAlign: 'center',
  },
});
