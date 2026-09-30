import type { BrandTokens } from './types';

const CSS_VARIABLE_NAMES = {
  brandPrimary: '--sr-brand-primary',
  brandPrimaryHover: '--sr-brand-primary-hover',
  brandAccent: '--sr-brand-accent',
  backgroundBase: '--sr-bg-base',
  backgroundElevated: '--sr-bg-elevated',
  backgroundMuted: '--sr-bg-muted',
  backgroundInset: '--sr-bg-inset',
  textPrimary: '--sr-text-primary',
  textSecondary: '--sr-text-secondary',
  textTertiary: '--sr-text-tertiary',
  textInverse: '--sr-text-inverse',
  borderDefault: '--sr-border-default',
  borderSubtle: '--sr-border-subtle',
  success: '--sr-success',
  warning: '--sr-warning',
  danger: '--sr-danger',
  info: '--sr-info',
  saleHot: '--sr-sale-hot',
  saleHotSurface: '--sr-sale-hot-surface',
  saleModerate: '--sr-sale-moderate',
  saleModerateSurface: '--sr-sale-moderate-surface',
  saleMuted: '--sr-sale-muted',
  saleMutedSurface: '--sr-sale-muted-surface',
  focusRing: '--sr-focus-ring',
} as const satisfies Record<keyof BrandTokens, `--sr-${string}`>;

export function toCssVariables(tokens: BrandTokens): string {
  const declarations = (Object.keys(CSS_VARIABLE_NAMES) as (keyof BrandTokens)[]).map(
    (key) => `${CSS_VARIABLE_NAMES[key]}: ${tokens[key]};`,
  );

  return `:root { ${declarations.join(' ')} }`;
}
