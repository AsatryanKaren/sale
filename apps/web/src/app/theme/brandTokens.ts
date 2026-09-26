import type { BrandTokens } from './types';

export const lightBrandTokens = {
  brandPrimary: '#111111',
  brandSecondary: '#2A2A2A',
  backgroundBase: '#F4F4F5',
  backgroundElevated: '#FFFFFF',
  backgroundMuted: '#E4E4E7',
  textPrimary: '#111111',
  textSecondary: '#71717A',
  textInverse: '#FAFAFA',
  borderDefault: '#E4E4E7',
  borderSubtle: '#F4F4F5',
  success: '#15803D',
  warning: '#C2410C',
  danger: '#E11D48',
  saleHot: '#E11D48',
  saleModerate: '#0F766E',
  saleMuted: '#71717A',
  focusRing: '#111111',
} as const satisfies BrandTokens;
