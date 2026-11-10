// ============================================================
// Code Attribution
// Usage: Implemented using the documented FlatList component (data, renderItem,
//        keyExtractor, ListHeaderComponent, ListEmptyComponent, ItemSeparatorComponent).
//        The filtering, sorting and screen layout are original AI-assisted code.
// Author: Meta Platforms, Inc. and React Native contributors
// Link: https://reactnative.dev/docs/using-a-listview
// Date Accessed: 10 November 2026
// Date Published: Not stated
// Version: React Native 0.87 documentation (the nearest version listed; this project uses 0.88)
// ============================================================

import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { EmptyState } from '../components/EmptyState';
import { EquipmentCard } from '../components/EquipmentCard';
import { FilterChips } from '../components/FilterChips';
import { ScreenHeader } from '../components/ScreenHeader';
import { SearchBar } from '../components/SearchBar';
import { SelectField } from '../components/SelectField';
import { StatTile } from '../components/StatTile';
import { useInventory } from '../context/InventoryContext';
import { BANNER_IMAGES } from '../data/images';
import { colors, shadows, spacing, typography } from '../theme/theme';
import type { Equipment, SortOption } from '../types/equipment';
import type { TabScreenProps } from '../types/navigation';
import { DEFAULT_FILTERS, filterEquipment, hasActiveFilters } from '../utils/filtering';
import type { InventoryFilters } from '../utils/filtering';
import { formatAveragePrice } from '../utils/formatting';
import { SORT_OPTIONS, sortEquipment } from '../utils/sorting';

export function InventoryScreen({ navigation }: TabScreenProps<'Inventory'>) {
  const { equipment, statistics, lowStockThreshold, toggleFavourite, loadDemoData } = useInventory();
  const [filters, setFilters] = useState<InventoryFilters>(DEFAULT_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption>('updated-desc');

  // The visible list is DERIVED from the source records every time something changes.
  // There is no second copy of the data to keep in sync, so add / edit / delete / favourite
  // are reflected immediately.
  const visibleEquipment = useMemo(
    () => sortEquipment(filterEquipment(equipment, filters), sortOption),
    [equipment, filters, sortOption],
  );
  const favouriteCount = useMemo(
    () => equipment.filter((item) => item.isFavourite === true).length,
    [equipment],
  );
  const filtersActive = hasActiveFilters(filters);

  const openDetails = useCallback(
    (id: string) => navigation.navigate('EquipmentDetails', { equipmentId: id }),
    [navigation],
  );
  const openAddForm = useCallback(() => navigation.navigate('EquipmentForm'), [navigation]);
  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const renderItem = useCallback(
    ({ item }: { item: Equipment }) => (
      <EquipmentCard
        item={item}
        lowStockThreshold={lowStockThreshold}
        onPress={openDetails}
        onToggleFavourite={toggleFavourite}
      />
    ),
    [lowStockThreshold, openDetails, toggleFavourite],
  );

  const hasRecords = equipment.length > 0;

  const controls = hasRecords ? (
    <View style={styles.controls}>
      <SearchBar
        value={filters.query}
        onChangeText={(query) => setFilters((previous) => ({ ...previous, query }))}
      />
      <FilterChips
        selected={filters.category}
        onSelect={(category) => setFilters((previous) => ({ ...previous, category }))}
        totalRecords={statistics.totalRecords}
        recordsByCategory={statistics.recordsByCategory}
        favouritesOnly={filters.favouritesOnly}
        favouriteCount={favouriteCount}
        onToggleFavourites={() =>
          setFilters((previous) => ({ ...previous, favouritesOnly: !previous.favouritesOnly }))
        }
      />
      <SelectField
        label="Sort by"
        value={sortOption}
        options={SORT_OPTIONS}
        onValueChange={(value) => {
          const match = SORT_OPTIONS.find((option) => option.value === value);
          if (match !== undefined) setSortOption(match.value);
        }}
      />
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText} accessibilityLiveRegion="polite">
          Showing {visibleEquipment.length} of {equipment.length}{' '}
          {equipment.length === 1 ? 'record' : 'records'}
        </Text>
        {filtersActive ? (
          <AppButton title="Clear all filters" variant="ghost" onPress={clearFilters} style={styles.clearButton} />
        ) : null}
      </View>
    </View>
  ) : null;

  const emptyComponent = hasRecords ? (
    <EmptyState
      icon="search-outline"
      title="No matching equipment"
      message="Nothing matches your search and filters. Try a different name or clear the filters."
    >
      <AppButton title="Clear all filters" icon="close-circle-outline" onPress={clearFilters} />
    </EmptyState>
  ) : (
    <EmptyState
      icon="barbell-outline"
      title="No equipment yet"
      message="Your inventory is empty. Add your first item, or load the workshop demo data."
    >
      <AppButton title="Add equipment" icon="add" onPress={openAddForm} />
      <AppButton title="Load demo data" icon="download-outline" variant="secondary" onPress={loadDemoData} />
    </EmptyState>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Inventory"
        subtitle="Campus gym equipment"
        image={BANNER_IMAGES.inventory}
      >
        <View style={styles.statsRow}>
          <StatTile tone="onGradient" label="Records" value={String(statistics.totalRecords)} />
          <StatTile
            tone="onGradient"
            label="Avg. unit price"
            value={formatAveragePrice(statistics.averageUnitPrice)}
          />
          <StatTile tone="onGradient" label="Units" value={String(statistics.totalUnits)} />
        </View>
        <Text style={styles.statsNote}>All inventory. Search and filters do not change these numbers.</Text>
      </ScreenHeader>

      <FlatList
        data={visibleEquipment}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={controls ?? undefined}
        ListEmptyComponent={emptyComponent}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={8}
      />

      {hasRecords ? (
        <View style={styles.fabHost} pointerEvents="box-none">
          <AppButton title="Add equipment" icon="add" onPress={openAddForm} style={styles.fab} />
        </View>
      ) : null}
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  statsNote: {
    ...typography.small,
    color: colors.lavender,
  },
  listContent: {
    flexGrow: 1,
    padding: 20,
    // Extra room at the bottom so the floating Add button never hides the last card.
    paddingBottom: 112,
  },
  controls: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  resultsText: {
    ...typography.smallStrong,
    color: colors.textOnTint,
  },
  clearButton: {
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  separator: {
    height: spacing.sm,
  },
  fabHost: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  fab: {
    paddingHorizontal: spacing.lg,
    ...shadows.raised,
  },
});
