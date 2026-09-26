import type { BrandTokens } from './types';

export const lightBrandTokens = {
  brandPrimary: '#0071E3',
  brandSecondary: '#1D1D1F',
  backgroundBase: '#F5F5F7',
  backgroundElevated: '#FFFFFF',
  backgroundMuted: '#E8E8ED',
  textPrimary: '#1D1D1F',
  textSecondary: '#6E6E73',
  textInverse: '#F5F5F7',
  borderDefault: '#D2D2D7',
  borderSubtle: '#E8E8ED',
  success: '#248A3D',
  warning: '#C93400',
  danger: '#E11D48',
  saleHot: '#E11D48',
  saleModerate: '#0F766E',
  saleMuted: '#6E6E73',
  focusRing: '#0071E3',
} as const satisfies BrandTokens;
