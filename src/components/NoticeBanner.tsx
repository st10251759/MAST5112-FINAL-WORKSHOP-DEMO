import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInventory } from '../context/InventoryContext';
import { colors, radii, shadows, spacing, typography } from '../theme/theme';
import type { IconName, NoticeType } from '../types/ui';
import { AppButton } from './AppButton';
import { IconButton } from './IconButton';

const PALETTE: Record<NoticeType, { icon: IconName; foreground: string; surface: string }> = {
  success: { icon: 'checkmark-circle', foreground: colors.teal, surface: colors.mint },
  info: { icon: 'information-circle', foreground: colors.primaryDeep, surface: colors.lavender },
  error: { icon: 'alert-circle', foreground: colors.error, surface: colors.errorSurface },
};

const AUTO_DISMISS_MS = 4000;

/**
 * App-wide feedback banner shown above every screen.
 *  - Success / info messages ("Added", "Deleted") fade away after a few seconds.
 *  - A storage failure stays visible, with a Retry button, until saving works again.
 * It is announced to screen readers through accessibilityLiveRegion.
 */
export function NoticeBanner() {
  const { notice, dismissNotice, storageError, retrySave } = useInventory();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (notice === null) return undefined;
    const timer = setTimeout(dismissNotice, notice.type === 'error' ? AUTO_DISMISS_MS * 2 : AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [notice, dismissNotice]);

  const showStorageError = storageError !== null;
  if (!showStorageError && notice === null) return null;

  const type: NoticeType = showStorageError ? 'error' : (notice?.type ?? 'info');
  const message = showStorageError ? storageError : (notice?.message ?? '');
  const palette = PALETTE[type];

  return (
    <View style={[styles.host, { top: insets.top + spacing.xs }]} pointerEvents="box-none">
      <View
        style={[styles.banner, { backgroundColor: palette.surface }]}
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
      >
        <Ionicons name={palette.icon} size={22} color={palette.foreground} />
        <View style={styles.textBlock}>
          <Text style={[styles.message, { color: palette.foreground }]}>{message}</Text>
          {showStorageError ? (
            <AppButton title="Retry saving" variant="danger" onPress={retrySave} style={styles.retry} />
          ) : null}
        </View>
        {!showStorageError ? (
          <IconButton
            icon="close"
            label="Dismiss message"
            onPress={dismissNotice}
            color={palette.foreground}
            size={40}
            iconSize={20}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 100,
    elevation: 12,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xxs,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    ...shadows.raised,
  },
  textBlock: {
    flex: 1,
    gap: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  message: {
    ...typography.smallStrong,
  },
  retry: {
    minHeight: 44,
    alignSelf: 'flex-start',
    paddingVertical: 0,
  },
});
