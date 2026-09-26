import type { BrandTokens } from './types';

export const lightBrandTokens = {
  brandPrimary: '#0B0B0C',
  brandSecondary: '#1F2937',
  backgroundBase: '#E9EDF2',
  backgroundElevated: '#FFFFFF',
  backgroundMuted: '#D7DEE7',
  textPrimary: '#0B0B0C',
  textSecondary: '#667085',
  textInverse: '#F8FAFC',
  borderDefault: '#D7DEE7',
  borderSubtle: '#E9EDF2',
  success: '#15803D',
  warning: '#C2410C',
  danger: '#E11D48',
  saleHot: '#E11D48',
  saleModerate: '#0F766E',
  saleMuted: '#667085',
  focusRing: '#0B0B0C',
} as const satisfies BrandTokens;
