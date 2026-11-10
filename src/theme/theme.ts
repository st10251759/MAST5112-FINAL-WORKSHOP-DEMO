import { Platform } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

// Central design tokens. Every screen and component reads from here.
//
// Contrast ratios against white (calculated with the WCAG formula):
//   primary #7C3AED on white 5.7:1, white on primary 5.7:1
//   textSecondary #64748B on white 4.76:1  (OK on white cards, 4.41:1 on the page background)
//   textOnTint #475569 is used instead of textSecondary when small text sits on the page
//   background or on lavender, where #64748B would fall below 4.5:1.
//   teal on mint 4.83:1, amber on amber surface 4.51:1, error on error surface 5.3:1
// Coral (#FB7185) is only 2.69:1 on white, so it is used for decoration, never for text.
export const colors = {
  primary: '#7C3AED',
  primaryDeep: '#4C1D95',
  navy: '#172554',
  lavender: '#EDE9FE',
  background: '#F7F5FF',
  white: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#64748B',
  textOnTint: '#475569',
  border: '#E2E8F0',
  teal: '#0F766E',
  mint: '#D1FAE5',
  amber: '#B45309',
  amberSurface: '#FEF3C7',
  error: '#B91C1C',
  errorSurface: '#FEE2E2',
  coral: '#FB7185',
  disabledSurface: '#E5E7EB',
  disabledText: '#6B7280',
} as const;

// 8-point scale (with a 4 for tight gaps).
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const layout = {
  screenPadding: 20,
  touchTarget: 48,
  buttonHeight: 52,
  inputHeight: 52,
} as const;

export const radii = {
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  small: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  smallStrong: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '700' },
} as const satisfies Record<string, TextStyle>;

const subtleShadow: ViewStyle = Platform.select<ViewStyle>({
  android: { elevation: 2 },
  default: {
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
}) as ViewStyle;

const raisedShadow: ViewStyle = Platform.select<ViewStyle>({
  android: { elevation: 3 },
  default: {
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
  },
}) as ViewStyle;

export const shadows = {
  card: subtleShadow,
  raised: raisedShadow,
} as const;

/** Maximum system font scaling for compact UI (badges, chips) so they do not break layouts. */
export const COMPACT_FONT_SCALE = 1.3;
