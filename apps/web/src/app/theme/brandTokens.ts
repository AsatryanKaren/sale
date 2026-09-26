import type { BrandTokens } from './types';

export const lightBrandTokens = {
  brandPrimary: '#0F766E',
  brandSecondary: '#134E4A',
  backgroundBase: '#F5F7F6',
  backgroundElevated: '#FFFFFF',
  backgroundMuted: '#E8EEEC',
  textPrimary: '#14201E',
  textSecondary: '#5B6B67',
  textInverse: '#F8FAFC',
  borderDefault: '#D5DED9',
  borderSubtle: '#E7EEEA',
  success: '#15803D',
  warning: '#B45309',
  danger: '#B91C1C',
  saleHot: '#C2410C',
  saleModerate: '#0F766E',
  saleMuted: '#64748B',
  focusRing: '#0D9488',
} as const satisfies BrandTokens;
