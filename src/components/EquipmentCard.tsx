import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, shadows, spacing, typography } from '../theme/theme';
import type { Equipment } from '../types/equipment';
import { formatCurrency } from '../utils/formatting';
import { getStockStatus } from '../utils/stock';
import { CategoryBadge } from './CategoryBadge';
import { EquipmentImage } from './EquipmentImage';
import { IconButton } from './IconButton';
import { StockBadge } from './StockBadge';

interface EquipmentCardProps {
  item: Equipment;
  lowStockThreshold: number;
  onPress: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

function EquipmentCardBase({ item, lowStockThreshold, onPress, onToggleFavourite }: EquipmentCardProps) {
  const status = getStockStatus(item.quantityAvailable, lowStockThreshold);
  const isFavourite = item.isFavourite === true;
  const stockText =
    status === 'out' ? 'Out of stock' : status === 'low' ? 'Low stock' : 'In stock';

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => onPress(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, ${item.category}, ${item.quantityAvailable} available, ${formatCurrency(item.unitPrice)} each, ${stockText}${isFavourite ? ', favourite' : ''}`}
        accessibilityHint="Opens the equipment details"
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <EquipmentImage
          uri={item.imageUrl}
          category={item.category}
          aspectRatio={1}
          style={styles.image}
          accessibilityLabel={`Photo for ${item.name}`}
        />
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.badges}>
            <CategoryBadge category={item.category} />
            <StockBadge status={status} quantity={item.quantityAvailable} />
          </View>
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="cube-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>Qty {item.quantityAvailable}</Text>
            </View>
            <Text style={styles.price}>{formatCurrency(item.unitPrice)}</Text>
          </View>
        </View>
      </Pressable>
      <IconButton
        icon={isFavourite ? 'heart' : 'heart-outline'}
        label={isFavourite ? `Remove ${item.name} from favourites` : `Add ${item.name} to favourites`}
        selected={isFavourite}
        onPress={() => onToggleFavourite(item.id)}
        color={colors.primary}
        size={40}
        iconSize={22}
        style={styles.favourite}
      />
    </View>
  );
}

/** memo: a card only re-renders when its own record (or the threshold) changes. */
export const EquipmentCard = memo(EquipmentCardBase);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    ...shadows.card,
  },
  main: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.sm,
    borderRadius: radii.lg,
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: colors.background,
  },
  image: {
    width: 92,
    borderRadius: radii.md,
  },
  body: {
    flex: 1,
    gap: spacing.xxs,
    justifyContent: 'center',
  },
  name: {
    ...typography.bodyStrong,
    color: colors.text,
    // Leaves room for the favourite button in the top-right corner.
    paddingRight: spacing.xl,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xxs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  metaText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  price: {
    ...typography.bodyStrong,
    color: colors.primaryDeep,
  },
  favourite: {
    position: 'absolute',
    top: spacing.xxs,
    right: spacing.xxs,
  },
});
