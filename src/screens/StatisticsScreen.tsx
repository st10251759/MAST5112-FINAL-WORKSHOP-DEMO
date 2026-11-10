import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { CategoryBar } from '../components/CategoryBar';
import { ScreenHeader } from '../components/ScreenHeader';
import { BANNER_IMAGES } from '../data/images';
import { StatTile } from '../components/StatTile';
import { useInventory } from '../context/InventoryContext';
import { COMPACT_FONT_SCALE, colors, radii, spacing, typography } from '../theme/theme';
import { CATEGORIES } from '../types/equipment';
import { formatAveragePrice, formatCurrency } from '../utils/formatting';

/** Small label that tells the reader what a block of numbers describes. */
function ScopeTag({ text }: { text: string }) {
  return (
    <View style={styles.scopeTag}>
      <Text style={styles.scopeText} maxFontSizeMultiplier={COMPACT_FONT_SCALE}>
        {text}
      </Text>
    </View>
  );
}

export function StatisticsScreen() {
  const { statistics, lowStockThreshold } = useInventory();
  const isEmpty = statistics.totalRecords === 0;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Statistics"
        subtitle="Calculated live from your saved records"
        image={BANNER_IMAGES.statistics}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* ---------- Required-equivalent statistics ---------- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Required statistics
          </Text>
          <ScopeTag text="All inventory" />
        </View>

        <View style={styles.tiles}>
          <StatTile label="Total records" value={String(statistics.totalRecords)} caption="equipment entries" />
          <StatTile
            label="Average unit price"
            value={formatAveragePrice(statistics.averageUnitPrice)}
            caption={isEmpty ? 'add equipment first' : 'per record'}
          />
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Records per category</Text>
          {CATEGORIES.map((category) => (
            <CategoryBar
              key={category}
              category={category}
              count={statistics.recordsByCategory[category]}
              total={statistics.totalRecords}
              unit="records"
            />
          ))}
          <Text style={styles.note}>
            {isEmpty
              ? 'No records yet. Add equipment or load the demo data to see these numbers.'
              : 'Each bar is measured against all records, so a full bar would mean every record.'}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>How the average is calculated</Text>
          <Text style={styles.note}>
            Average unit price = sum of every record's unit price ÷ number of records. Each record
            counts once, whatever its quantity (it is not weighted by units).
          </Text>
        </Card>

        {/* ---------- Extra gym statistics ---------- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Extra gym statistics
          </Text>
          <ScopeTag text="All inventory · extra" />
        </View>

        <View style={styles.tiles}>
          <StatTile label="Total units" value={String(statistics.totalUnits)} caption="sum of quantities" />
          <StatTile
            label="Replacement value"
            value={formatCurrency(statistics.replacementValue)}
            caption="unit price × quantity"
          />
        </View>
        <View style={styles.tiles}>
          <StatTile
            label="Low stock"
            value={String(statistics.lowStockRecords)}
            caption={`records with 1 to ${lowStockThreshold} units`}
          />
          <StatTile label="Out of stock" value={String(statistics.outOfStockRecords)} caption="records with 0 units" />
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Units per category</Text>
          {CATEGORIES.map((category) => (
            <CategoryBar
              key={category}
              category={category}
              count={statistics.unitsByCategory[category]}
              total={statistics.totalUnits}
              unit="units"
            />
          ))}
          <Text style={styles.note}>Units are physical items, so these numbers differ from the record counts above.</Text>
        </Card>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.text,
  },
  scopeTag: {
    backgroundColor: colors.lavender,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  scopeText: {
    ...typography.label,
    color: colors.primaryDeep,
  },
  tiles: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  card: {
    gap: spacing.sm,
  },
  cardTitle: {
    ...typography.heading,
    color: colors.text,
  },
  note: {
    ...typography.small,
    color: colors.textSecondary,
  },
});
