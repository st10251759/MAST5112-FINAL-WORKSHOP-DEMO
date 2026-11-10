import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, layout, radii } from '../theme/theme';
import type { IconName } from '../types/ui';

interface IconButtonProps {
  icon: IconName;
  /** Required: icon-only buttons need a spoken label for screen readers. */
  label: string;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
  /** Visible size. hitSlop pads the touch area up to at least 48dp. */
  size?: number;
  iconSize?: number;
  selected?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon,
  label,
  onPress,
  color = colors.primaryDeep,
  backgroundColor = 'transparent',
  size = layout.touchTarget,
  iconSize = 24,
  selected,
  disabled = false,
  style,
}: IconButtonProps) {
  const slop = Math.max(0, Math.ceil((layout.touchTarget - size) / 2));
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={slop}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, backgroundColor },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Ionicons name={icon} size={iconSize} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
  },
  pressed: {
    opacity: 0.7,
  },
});
