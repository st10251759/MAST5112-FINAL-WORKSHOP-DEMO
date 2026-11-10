import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { Ref } from 'react';
import type { TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, layout, radii, spacing, typography } from '../theme/theme';
import type { TextInputHandle } from '../types/ui';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  inputRef?: Ref<TextInputHandle>;
}

/** Labelled input with an inline error underneath. Used for every text entry in the form. */
export function TextField({
  label,
  required = false,
  error,
  hint,
  multiline = false,
  inputRef,
  ...inputProps
}: TextFieldProps) {
  const hasError = error !== undefined && error.length > 0;
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <TextInput
        ref={inputRef}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel={required ? `${label}, required` : label}
        accessibilityHint={hint}
        style={[styles.input, multiline && styles.multiline, hasError && styles.inputError]}
        {...inputProps}
      />
      {hasError ? (
        <View style={styles.messageRow} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
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
  input: {
    ...typography.body,
    minHeight: layout.inputHeight,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  multiline: {
    minHeight: 112,
    paddingTop: spacing.sm,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorSurface,
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
  hint: {
    ...typography.small,
    color: colors.textSecondary,
  },
});
