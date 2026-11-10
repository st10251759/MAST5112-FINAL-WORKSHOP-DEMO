import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/theme';
import { CATEGORIES } from '../types/equipment';
import type { EquipmentFormValues, EquipmentInput, FormErrors } from '../types/equipment';
import type { TextInputHandle } from '../types/ui';
import {
  validateEquipmentForm,
  validateImageUrl,
  validateSingleField,
} from '../utils/validation';
import { AppButton } from './AppButton';
import { EquipmentImage } from './EquipmentImage';
import { SelectField } from './SelectField';
import { TextField } from './TextField';

interface EquipmentFormProps {
  mode: 'add' | 'edit';
  initialValues: EquipmentFormValues;
  onSubmit: (input: EquipmentInput) => void;
  onCancel: () => void;
  /** Lets the screen know about unsaved changes so it can warn before leaving. */
  onDirtyChange: (isDirty: boolean) => void;
}

export const EMPTY_FORM_VALUES: EquipmentFormValues = {
  name: '',
  description: '',
  category: '',
  quantity: '',
  unitPrice: '',
  imageUrl: '',
};

const CATEGORY_OPTIONS = CATEGORIES.map((category) => ({ label: category, value: category }));

/**
 * One form for both Add and Edit. The text the user typed lives in `values` as strings and
 * is only turned into numbers by validateEquipmentForm, so a failed save never loses input.
 */
export function EquipmentForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  onDirtyChange,
}: EquipmentFormProps) {
  const [values, setValues] = useState<EquipmentFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewUri, setPreviewUri] = useState<string>(() => {
    const result = validateImageUrl(initialValues.imageUrl);
    return result.ok ? result.value : '';
  });

  const descriptionRef = useRef<TextInputHandle>(null);
  const quantityRef = useRef<TextInputHandle>(null);
  const priceRef = useRef<TextInputHandle>(null);
  const imageRef = useRef<TextInputHandle>(null);
  const errorSummaryCount = Object.values(errors).filter((message) => message !== undefined).length;

  // Unsaved-changes tracking: dirty means "different from what the form started with".
  useEffect(() => {
    const isDirty = (Object.keys(initialValues) as Array<keyof EquipmentFormValues>).some(
      (field) => values[field] !== initialValues[field],
    );
    onDirtyChange(isDirty);
  }, [values, initialValues, onDirtyChange]);

  function updateField<K extends keyof EquipmentFormValues>(field: K, value: EquipmentFormValues[K]) {
    const next: EquipmentFormValues = { ...values, [field]: value };
    setValues(next);
    // Once a field is showing an error, re-check it on every keystroke so the message
    // disappears as soon as the problem is fixed.
    if (errors[field] !== undefined) {
      setErrors((previous) => ({ ...previous, [field]: validateSingleField(field, next) }));
    }
  }

  function checkField(field: keyof EquipmentFormValues) {
    setErrors((previous) => ({ ...previous, [field]: validateSingleField(field, values) }));
  }

  function handleImageBlur() {
    checkField('imageUrl');
    // The preview only refreshes when the user leaves the field, so we do not download
    // half-typed addresses on every keystroke.
    const result = validateImageUrl(values.imageUrl);
    setPreviewUri(result.ok ? result.value : '');
  }

  function handleSubmit() {
    const result = validateEquipmentForm(values);
    if (!result.ok) {
      // Values stay exactly as typed; only the error messages are added.
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onSubmit(result.input);
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.content}
    >
      {errorSummaryCount > 0 ? (
        <View style={styles.summary} accessibilityRole="alert" accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={20} color={colors.error} />
          <Text style={styles.summaryText}>
            {errorSummaryCount === 1
              ? 'Please fix 1 field below, then save again.'
              : `Please fix ${errorSummaryCount} fields below, then save again.`}
          </Text>
        </View>
      ) : null}

      <TextField
        label="Equipment name"
        required
        value={values.name}
        onChangeText={(text) => updateField('name', text)}
        onBlur={() => checkField('name')}
        error={errors.name}
        placeholder="e.g. Treadmill Pro T900"
        returnKeyType="next"
        onSubmitEditing={() => descriptionRef.current?.focus()}
        maxLength={80}
      />

      <TextField
        label="Description"
        required
        value={values.description}
        onChangeText={(text) => updateField('description', text)}
        onBlur={() => checkField('description')}
        error={errors.description}
        placeholder="What is it and what is it used for?"
        multiline
        inputRef={descriptionRef}
        maxLength={400}
      />

      <SelectField
        label="Category"
        required
        value={values.category}
        placeholder="Select a category…"
        options={CATEGORY_OPTIONS}
        onValueChange={(value) => {
          const next = CATEGORIES.find((category) => category === value) ?? '';
          updateField('category', next);
        }}
        error={errors.category}
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <TextField
            label="Quantity available"
            required
            value={values.quantity}
            onChangeText={(text) => updateField('quantity', text)}
            onBlur={() => checkField('quantity')}
            error={errors.quantity}
            placeholder="0"
            keyboardType="number-pad"
            returnKeyType="next"
            inputRef={quantityRef}
            onSubmitEditing={() => priceRef.current?.focus()}
            maxLength={6}
          />
        </View>
        <View style={styles.half}>
          <TextField
            label="Unit price (R)"
            required
            value={values.unitPrice}
            onChangeText={(text) => updateField('unitPrice', text)}
            onBlur={() => checkField('unitPrice')}
            error={errors.unitPrice}
            placeholder="0.00"
            keyboardType="decimal-pad"
            returnKeyType="next"
            inputRef={priceRef}
            onSubmitEditing={() => imageRef.current?.focus()}
            maxLength={12}
          />
        </View>
      </View>

      <TextField
        label="Image URL (optional)"
        value={values.imageUrl}
        onChangeText={(text) => updateField('imageUrl', text)}
        onBlur={handleImageBlur}
        error={errors.imageUrl}
        hint="Paste a web address starting with https://. The preview updates when you leave this field."
        placeholder="https://…"
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        inputRef={imageRef}
        maxLength={500}
      />

      <EquipmentImage
        uri={previewUri}
        category={values.category === '' ? 'Strength' : values.category}
        aspectRatio={16 / 9}
        iconSize={40}
        showFallbackLabel
        accessibilityLabel="Image preview"
        style={styles.preview}
      />

      <View style={styles.actions}>
        <AppButton
          title={mode === 'add' ? 'Add equipment' : 'Save changes'}
          icon="checkmark"
          onPress={handleSubmit}
        />
        <AppButton title="Cancel" variant="secondary" onPress={onCancel} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.errorSurface,
  },
  summaryText: {
    ...typography.smallStrong,
    flex: 1,
    color: colors.error,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  half: {
    flex: 1,
  },
  preview: {
    width: '100%',
    borderRadius: 16,
  },
  actions: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
});
