// ============================================================
// Code Attribution
// Usage: Alert.alert with Cancel / destructive buttons for the two confirmations below.
//        Documented React Native API; the screen itself is original AI-assisted code.
// Author: Meta Platforms, Inc. and React Native contributors
// Link: https://reactnative.dev/docs/alert
// Date Accessed: Not consulted in this session. Verify the page before submission.
// Date Published: Not stated
// ============================================================

import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { IconButton } from '../components/IconButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { BANNER_IMAGES } from '../data/images';
import { DEMO_EQUIPMENT } from '../data/demoEquipment';
import { useInventory } from '../context/InventoryContext';
import { colors, radii, spacing, typography } from '../theme/theme';
import { formatCount } from '../utils/formatting';
import { MAX_LOW_STOCK_THRESHOLD, MIN_LOW_STOCK_THRESHOLD } from '../utils/stock';

export function SettingsScreen() {
  const { equipment, lowStockThreshold, setLowStockThreshold, loadDemoData, clearInventory } =
    useInventory();
  const recordCount = equipment.length;

  function handleLoadDemo() {
    if (recordCount === 0) {
      loadDemoData();
      return;
    }
    // Loading demo data REPLACES the current records, so ask first.
    Alert.alert(
      'Replace inventory with demo data?',
      `Your ${formatCount(recordCount, 'current record', 'current records')} will be replaced by the ${DEMO_EQUIPMENT.length} demo records. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Replace', style: 'destructive', onPress: loadDemoData },
      ],
      { cancelable: true },
    );
  }

  function handleClear() {
    Alert.alert(
      'Clear the whole inventory?',
      `All ${formatCount(recordCount, 'record', 'records')} will be permanently deleted. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear inventory', style: 'destructive', onPress: clearInventory },
      ],
      { cancelable: true },
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Settings"
        subtitle="Workshop tools and stock rules"
        image={BANNER_IMAGES.settings}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Low-stock threshold</Text>
          <Text style={styles.body}>
            Records with 1 to {lowStockThreshold} units are marked "Low stock". Records with 0 units
            are always marked "Out of stock". This is a gym enhancement, not part of the restaurant POE.
          </Text>
          <View style={styles.stepper}>
            <IconButton
              icon="remove"
              label="Decrease low-stock threshold"
              onPress={() => setLowStockThreshold(lowStockThreshold - 1)}
              disabled={lowStockThreshold <= MIN_LOW_STOCK_THRESHOLD}
              backgroundColor={colors.lavender}
            />
            <Text style={styles.stepperValue} accessibilityLiveRegion="polite">
              {lowStockThreshold} {lowStockThreshold === 1 ? 'unit' : 'units'} or fewer
            </Text>
            <IconButton
              icon="add"
              label="Increase low-stock threshold"
              onPress={() => setLowStockThreshold(lowStockThreshold + 1)}
              disabled={lowStockThreshold >= MAX_LOW_STOCK_THRESHOLD}
              backgroundColor={colors.lavender}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Demo data</Text>
          <Text style={styles.body}>
            Loads {DEMO_EQUIPMENT.length} example records across Cardio, Strength and Accessories,
            including one out-of-stock and three low-stock items. Demo data is never added
            automatically, so an emptied inventory stays empty.
          </Text>
          <AppButton title="Load demo data" icon="download-outline" onPress={handleLoadDemo} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Clear inventory</Text>
          <Text style={styles.body}>
            Permanently deletes every record on this device. You currently have{' '}
            {formatCount(recordCount, 'record', 'records')}.
          </Text>
          <AppButton
            title="Clear inventory"
            icon="trash-outline"
            variant="danger"
            onPress={handleClear}
            disabled={recordCount === 0}
          />
        </Card>

        <View style={styles.about}>
          <Text style={styles.aboutTitle}>About this app</Text>
          <Text style={styles.aboutText}>
            CampusFit Inventory is a tutor demonstration for MAST5112 using a campus gym scenario.
            The actual student POE is a restaurant menu manager. Records are saved on this device
            only (AsyncStorage). There is no account, server or cloud backup.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  card: {
    gap: spacing.sm,
  },
  cardTitle: {
    ...typography.heading,
    color: colors.text,
  },
  body: {
    ...typography.small,
    color: colors.textSecondary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: radii.md,
    padding: spacing.xs,
  },
  stepperValue: {
    ...typography.bodyStrong,
    color: colors.primaryDeep,
    textAlign: 'center',
    flex: 1,
  },
  about: {
    gap: spacing.xxs,
    paddingHorizontal: spacing.xxs,
  },
  aboutTitle: {
    ...typography.smallStrong,
    color: colors.text,
  },
  aboutText: {
    ...typography.small,
    color: colors.textOnTint,
  },
});
