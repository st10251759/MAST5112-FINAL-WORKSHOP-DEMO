import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { CategoryBadge } from '../components/CategoryBadge';
import { EmptyState } from '../components/EmptyState';
import { EquipmentImage } from '../components/EquipmentImage';
import { IconButton } from '../components/IconButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { BANNER_IMAGES } from '../data/images';
import { StatTile } from '../components/StatTile';
import { StockBadge } from '../components/StockBadge';
import { useInventory } from '../context/InventoryContext';
import { colors, spacing, typography } from '../theme/theme';
import type { RootStackScreenProps } from '../types/navigation';
import { formatCurrency, formatDateTime } from '../utils/formatting';
import { getStockStatus } from '../utils/stock';

export function EquipmentDetailsScreen({ navigation, route }: RootStackScreenProps<'EquipmentDetails'>) {
  const { equipmentId } = route.params;
  const { getEquipmentById, deleteEquipment, toggleFavourite, lowStockThreshold } = useInventory();
  const insets = useSafeAreaInsets();
  const [isDeleting, setIsDeleting] = useState(false);

  // The record is looked up from shared state on every render (never copied into local
  // state), so edits and favourite changes show here immediately and never go stale.
  const item = getEquipmentById(equipmentId);

  // Between "confirm delete" and the screen closing, render nothing rather than flash
  // a "not found" message.
  if (isDeleting) {
    return <View style={styles.screen} />;
  }

  if (item === undefined) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Equipment details" image={BANNER_IMAGES.details} onBack={() => navigation.goBack()} />
        <EmptyState
          icon="help-circle-outline"
          title="Equipment not found"
          message="This record no longer exists. It may have been deleted."
        >
          <AppButton title="Back to inventory" onPress={() => navigation.goBack()} />
        </EmptyState>
      </View>
    );
  }

  const status = getStockStatus(item.quantityAvailable, lowStockThreshold);
  const isFavourite = item.isFavourite === true;
  // Whole-cent arithmetic to avoid floating point drift.
  const stockValue = (Math.round(item.unitPrice * 100) * item.quantityAvailable) / 100;

  // Decision: native Alert for confirmation. It is accessible by default, handles the
  // Android Back button and tapping outside (both cancel), and needs no extra state.
  function confirmDelete() {
    if (item === undefined) return;
    const { id, name } = item;
    Alert.alert(
      'Delete equipment?',
      `"${name}" will be permanently removed from the inventory.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setIsDeleting(true);
            deleteEquipment(id);
            navigation.goBack();
          },
        },
      ],
      { cancelable: true },
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Equipment details"
        image={BANNER_IMAGES.details}
        onBack={() => navigation.goBack()}
        right={
          <IconButton
            icon={isFavourite ? 'heart' : 'heart-outline'}
            label={isFavourite ? `Remove ${item.name} from favourites` : `Add ${item.name} to favourites`}
            selected={isFavourite}
            onPress={() => toggleFavourite(item.id)}
            color={colors.white}
            backgroundColor="rgba(255,255,255,0.16)"
          />
        }
      />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
        <EquipmentImage
          uri={item.imageUrl}
          category={item.category}
          aspectRatio={16 / 10}
          iconSize={56}
          showFallbackLabel
          accessibilityLabel={`Photo for ${item.name}`}
          style={styles.image}
        />

        <View style={styles.titleBlock}>
          <Text style={styles.name} accessibilityRole="header">
            {item.name}
          </Text>
          <View style={styles.badges}>
            <CategoryBadge category={item.category} />
            <StockBadge status={status} quantity={item.quantityAvailable} />
            {isFavourite ? <FavouriteTag /> : null}
          </View>
        </View>

        <View style={styles.tiles}>
          <StatTile label="Quantity available" value={String(item.quantityAvailable)} />
          <StatTile label="Unit price" value={formatCurrency(item.unitPrice)} />
        </View>

        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.body}>{item.description}</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Stock value</Text>
          <Text style={styles.body}>
            {formatCurrency(stockValue)} ({item.quantityAvailable} × {formatCurrency(item.unitPrice)})
          </Text>
          <Text style={styles.sectionLabel}>Last updated</Text>
          <Text style={styles.body}>{formatDateTime(item.updatedAt)}</Text>
          <Text style={styles.sectionLabel}>Added</Text>
          <Text style={styles.body}>{formatDateTime(item.createdAt)}</Text>
        </Card>

        <View style={styles.actions}>
          <AppButton
            title="Edit equipment"
            icon="create-outline"
            onPress={() => navigation.navigate('EquipmentForm', { equipmentId: item.id })}
          />
          <AppButton title="Delete equipment" icon="trash-outline" variant="danger" onPress={confirmDelete} />
        </View>
      </ScrollView>
    </View>
  );
}

/** Text + icon tag, so "favourite" is not shown by the heart colour alone. */
function FavouriteTag() {
  return (
    <View style={styles.favouriteTag}>
      <Text style={styles.favouriteText}>♥ Favourite</Text>
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
    gap: spacing.md,
  },
  image: {
    width: '100%',
    borderRadius: 20,
  },
  titleBlock: {
    gap: spacing.xs,
  },
  name: {
    ...typography.display,
    fontSize: 26,
    color: colors.text,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tiles: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  card: {
    gap: spacing.xxs,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: spacing.xxs,
  },
  body: {
    ...typography.body,
    color: colors.text,
  },
  actions: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  favouriteTag: {
    backgroundColor: colors.lavender,
    borderRadius: 999,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    alignSelf: 'flex-start',
  },
  favouriteText: {
    ...typography.label,
    color: colors.primaryDeep,
  },
});
