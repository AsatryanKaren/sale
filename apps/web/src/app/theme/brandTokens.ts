import type { BrandTokens } from './types';

export const lightBrandTokens = {
  brandPrimary: '#0B1F33',
  brandSecondary: '#16324F',
  backgroundBase: '#E8EEF3',
  backgroundElevated: '#FFFFFF',
  backgroundMuted: '#D7E0E9',
  textPrimary: '#0B1F33',
  textSecondary: '#5A6B7C',
  textInverse: '#F7FAFC',
  borderDefault: '#C5D0DB',
  borderSubtle: '#DCE4EC',
  success: '#0F7A4A',
  warning: '#C45C0A',
  danger: '#C81E1E',
  saleHot: '#E2461A',
  saleModerate: '#0F6E8C',
  saleMuted: '#6B7C8F',
  focusRing: '#E2461A',
} as const satisfies BrandTokens;
