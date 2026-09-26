import type { ThemeConfig } from 'antd';

import { lightBrandTokens } from './brandTokens';
import { createComponentTokens } from './componentTokens';
import type { BrandTokens, ThemeMode } from './types';

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
      colorInfo: tokens.saleModerate,
      colorSuccess: tokens.success,
      colorWarning: tokens.warning,
      colorError: tokens.danger,
      colorText: tokens.textPrimary,
      colorTextSecondary: tokens.textSecondary,
      colorTextTertiary: tokens.textSecondary,
      colorBgBase: tokens.backgroundBase,
      colorBgContainer: tokens.backgroundElevated,
      colorBgLayout: tokens.backgroundBase,
      colorBgElevated: tokens.backgroundElevated,
      colorBorder: tokens.borderDefault,
      colorBorderSecondary: tokens.borderSubtle,
      borderRadius: 16,
      fontFamily: '"Figtree", "Avenir Next", "Segoe UI", sans-serif',
      fontSize: 15,
      lineHeight: 1.5,
      controlOutline: tokens.focusRing,
      boxShadowSecondary: '0 18px 40px rgba(11, 31, 51, 0.08)',
    },
    ...(components ? { components } : {}),
  };
}

export const defaultTheme = createTheme('light', lightBrandTokens);
