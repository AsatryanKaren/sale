import type { ThemeConfig } from 'antd';

import { lightBrandTokens } from './brandTokens';
import { createComponentTokens } from './componentTokens';
import type { BrandTokens, ThemeMode } from './types';

export const FONT_FAMILY_SANS =
  '"Geist Variable", "Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

export function createTheme(
  mode: ThemeMode = 'light',
  tokens: BrandTokens = lightBrandTokens,
): ThemeConfig {
  const components = createComponentTokens(tokens);

  return {
    cssVar: {
      key: `saleradar-${mode}`,
    },
    hashed: false,
    token: {
      colorPrimary: tokens.brandPrimary,
      colorPrimaryHover: tokens.brandPrimaryHover,
      colorInfo: tokens.brandPrimary,
      colorLink: tokens.textPrimary,
      colorSuccess: tokens.success,
      colorWarning: tokens.warning,
      colorError: tokens.danger,
      colorText: tokens.textPrimary,
      colorTextSecondary: tokens.textSecondary,
      colorTextTertiary: tokens.textTertiary,
      colorTextPlaceholder: tokens.textTertiary,
      colorBgBase: tokens.backgroundElevated,
      colorBgContainer: tokens.backgroundElevated,
      colorBgLayout: tokens.backgroundBase,
      colorBgElevated: tokens.backgroundElevated,
      colorBorder: tokens.borderDefault,
      colorBorderSecondary: tokens.borderSubtle,
      colorFillSecondary: tokens.backgroundMuted,
      borderRadius: 12,
      fontFamily: FONT_FAMILY_SANS,
      fontSize: 14,
      lineHeight: 1.5,
      controlOutline: `color-mix(in srgb, ${tokens.focusRing} 18%, transparent)`,
      boxShadowSecondary:
        '0 1px 2px rgba(22, 22, 26, 0.04), 0 12px 32px -8px rgba(22, 22, 26, 0.14)',
      motionDurationMid: '0.18s',
    },
    ...(components ? { components } : {}),
  };
}

export const defaultTheme = createTheme('light', lightBrandTokens);
