import type { BrandTokens } from './types';

/**
 * Single source of truth for brand colors. Ant Design reads them through
 * `createTheme`, and CSS modules read them as `--sr-*` variables emitted by
 * `ThemeCssVariables`.
 */
export const lightBrandTokens = {
  brandPrimary: '#16161A',
  brandPrimaryHover: '#2E2E35',
  brandAccent: '#FF5A1F',
  backgroundBase: '#F6F6F3',
  backgroundElevated: '#FFFFFF',
  backgroundMuted: '#EFEFEA',
  backgroundInset: '#F9F9F7',
  textPrimary: '#16161A',
  textSecondary: '#63636B',
  textTertiary: '#9A9AA2',
  textInverse: '#FAFAF7',
  borderDefault: '#E2E2DC',
  borderSubtle: '#ECECE7',
  success: '#15803D',
  warning: '#B45309',
  danger: '#D92D20',
  saleHot: '#E8430F',
  saleHotSurface: '#FFEDE5',
  saleModerate: '#B54708',
  saleModerateSurface: '#FEF4E6',
  saleMuted: '#71717A',
  saleMutedSurface: '#F1F1ED',
  focusRing: '#FF5A1F',
} as const satisfies BrandTokens;
