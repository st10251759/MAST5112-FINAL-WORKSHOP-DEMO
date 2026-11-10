import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, layout, radii, spacing, typography } from '../theme/theme';
import { IconButton } from './IconButton';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

/** Search box that updates results on every keystroke and has a clear (x) button. */
export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={colors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search equipment by name"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Search equipment by name"
      />
      {value.length > 0 ? (
        <IconButton
          icon="close-circle"
          label="Clear search"
          onPress={() => onChangeText('')}
          color={colors.textOnTint}
          size={40}
          iconSize={22}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.inputHeight,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingLeft: spacing.md,
    paddingRight: spacing.xxs,
    gap: spacing.xs,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
});
