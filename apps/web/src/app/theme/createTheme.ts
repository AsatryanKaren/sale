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
      colorInfo: tokens.brandPrimary,
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
      borderRadius: 12,
      fontFamily:
        '"Source Sans 3", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      fontSize: 15,
      lineHeight: 1.5,
      controlOutline: tokens.focusRing,
      boxShadowSecondary: '0 8px 24px rgba(20, 32, 30, 0.06)',
    },
    ...(components ? { components } : {}),
  };
}

export const defaultTheme = createTheme('light', lightBrandTokens);
