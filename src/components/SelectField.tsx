// ============================================================
// Code Attribution
// Usage: Implemented using the documented Picker and Picker.Item API (selectedValue,
//        onValueChange, mode, dropdownIconColor). The label, border and error wrapper
//        are original AI-assisted code written for this project.
// Author: react-native-picker contributors
// Link: https://github.com/react-native-picker/picker
// Date Accessed: 10 November 2026
// Date Published: Not stated
// Version: @react-native-picker/picker 2.11.4 (the version bundled with Expo SDK 58)
// ============================================================

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, layout, radii, spacing, typography } from '../theme/theme';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: readonly SelectOption[];
  onValueChange: (value: string) => void;
  /** When given, an empty "nothing chosen" item is shown first with this text. */
  placeholder?: string;
  required?: boolean;
  error?: string;
}

/** Labelled native dropdown (Android) / wheel (iOS) with an inline error underneath. */
export function SelectField({
  label,
  value,
  options,
  onValueChange,
  placeholder,
  required = false,
  error,
}: SelectFieldProps) {
  const hasError = error !== undefined && error.length > 0;
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <View style={[styles.box, hasError && styles.boxError]}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onValueChange(String(itemValue))}
          mode="dropdown"
          dropdownIconColor={colors.primaryDeep}
          style={styles.picker}
          accessibilityLabel={required ? `${label}, required` : label}
        >
          {placeholder !== undefined ? (
            <Picker.Item label={placeholder} value="" color={colors.textSecondary} />
          ) : null}
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              color={colors.text}
            />
          ))}
        </Picker>
      </View>
      {hasError ? (
        <View style={styles.messageRow} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xxs,
  },
  label: {
    ...typography.smallStrong,
    color: colors.text,
  },
  required: {
    color: colors.error,
  },
  box: {
    minHeight: layout.inputHeight,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  boxError: {
    borderColor: colors.error,
    backgroundColor: colors.errorSurface,
  },
  picker: {
    color: colors.text,
    width: '100%',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xxs,
  },
  errorText: {
    ...typography.small,
    flex: 1,
    color: colors.error,
  },
});
