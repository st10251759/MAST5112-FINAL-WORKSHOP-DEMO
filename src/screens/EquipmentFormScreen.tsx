// ============================================================
// Code Attribution
// Usage: Implemented using the documented usePreventRemove hook for the "discard unsaved
//        changes?" confirmation, as recommended for native-stack navigators. The form
//        wiring around it is original AI-assisted code written for this project.
// Author: React Navigation contributors
// Link: https://reactnavigation.org/docs/use-prevent-remove
// Date Accessed: 10 November 2026
// Date Published: Not stated
// Version: @react-navigation/native 7.x
// ============================================================
// Usage: KeyboardAvoidingView (behavior="padding") around the form so the keyboard does not
//        cover fields. Documented React Native component.
// Author: Meta Platforms, Inc. and React Native contributors
// Link: https://reactnative.dev/docs/keyboardavoidingview
// Date Accessed: Not consulted in this session. Verify the page before submission.
// Date Published: Not stated
// ============================================================

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { usePreventRemove } from '@react-navigation/native';
import { AppButton } from '../components/AppButton';
import { EMPTY_FORM_VALUES, EquipmentForm } from '../components/EquipmentForm';
import { EmptyState } from '../components/EmptyState';
import { ScreenHeader } from '../components/ScreenHeader';
import { BANNER_IMAGES } from '../data/images';
import { useInventory } from '../context/InventoryContext';
import { colors } from '../theme/theme';
import type { EquipmentFormValues, EquipmentInput } from '../types/equipment';
import type { RootStackScreenProps } from '../types/navigation';

export function EquipmentFormScreen({ navigation, route }: RootStackScreenProps<'EquipmentForm'>) {
  const equipmentId = route.params?.equipmentId;
  const isEdit = equipmentId !== undefined;
  const { getEquipmentById, addEquipment, updateEquipment } = useInventory();
  const existing = equipmentId !== undefined ? getEquipmentById(equipmentId) : undefined;

  const [isDirty, setIsDirty] = useState(false);
  // Set to true right after a successful save so the "discard changes?" guard steps aside.
  const [isLeaving, setIsLeaving] = useState(false);

  // Edit mode: prepopulate from the stored record. Memoised so the form is seeded only once
  // and typing is never overwritten by a re-render.
  const initialValues = useMemo<EquipmentFormValues>(() => {
    if (existing === undefined) return EMPTY_FORM_VALUES;
    return {
      name: existing.name,
      description: existing.description,
      category: existing.category,
      quantity: String(existing.quantityAvailable),
      unitPrice: existing.unitPrice.toFixed(2),
      imageUrl: existing.imageUrl,
    };
    // Only the id matters: later edits to the same record must not reset the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipmentId, existing === undefined]);

  usePreventRemove(isDirty && !isLeaving, ({ data }) => {
    Alert.alert(
      'Discard changes?',
      'You have unsaved changes. If you leave now they will be lost.',
      [
        { text: 'Keep editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.dispatch(data.action),
        },
      ],
      { cancelable: true },
    );
  });

  // Leave only after the guard has been switched off by the re-render.
  useEffect(() => {
    if (isLeaving) {
      navigation.goBack();
    }
  }, [isLeaving, navigation]);

  const handleDirtyChange = useCallback((dirty: boolean) => setIsDirty(dirty), []);

  const handleSubmit = useCallback(
    (input: EquipmentInput) => {
      if (equipmentId !== undefined) {
        updateEquipment(equipmentId, input);
      } else {
        addEquipment(input);
      }
      setIsLeaving(true);
    },
    [equipmentId, addEquipment, updateEquipment],
  );

  const title = isEdit ? 'Edit equipment' : 'Add equipment';

  if (isEdit && existing === undefined) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title={title} image={BANNER_IMAGES.form} onBack={() => navigation.goBack()} />
        <EmptyState
          icon="help-circle-outline"
          title="Equipment not found"
          message="This record may have been deleted. Go back to the inventory to continue."
        >
          <AppButton title="Back to inventory" onPress={() => navigation.goBack()} />
        </EmptyState>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={title}
        image={BANNER_IMAGES.form}
        subtitle={isEdit ? 'Update the details below' : 'Fill in the details below'}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <EquipmentForm
          mode={isEdit ? 'edit' : 'add'}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={() => navigation.goBack()}
          onDirtyChange={handleDirtyChange}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
});
