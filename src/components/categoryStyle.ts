import { colors } from '../theme/theme';
import type { Category } from '../types/equipment';
import type { IconName } from '../types/ui';

// One place that decides how each category looks, so badges, bars and fallback images
// always agree. Every badge also carries an icon AND a text label, so category is never
// communicated by colour alone.
export const CATEGORY_STYLE: Record<Category, { icon: IconName; foreground: string; surface: string }> = {
  Cardio: { icon: 'bicycle', foreground: colors.teal, surface: colors.mint },
  Strength: { icon: 'barbell', foreground: colors.primaryDeep, surface: colors.lavender },
  Accessories: { icon: 'fitness', foreground: colors.amber, surface: colors.amberSurface },
};
