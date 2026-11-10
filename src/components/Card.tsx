import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { colors, radii, shadows, spacing } from '../theme/theme';

interface CardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

/** White rounded surface with a subtle shadow. The base of most blocks in the app. */
export function Card({ style, children, ...rest }: CardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.card,
  },
});
