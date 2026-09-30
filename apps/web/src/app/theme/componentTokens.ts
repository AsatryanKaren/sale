import type { ThemeConfig } from 'antd';

import type { BrandTokens } from './types';

export function createComponentTokens(tokens: BrandTokens): ThemeConfig['components'] {
  return {
    Button: {
      borderRadius: 999,
      borderRadiusLG: 999,
      borderRadiusSM: 999,
      controlHeight: 38,
      controlHeightSM: 30,
      fontWeight: 600,
      primaryShadow: 'none',
      defaultShadow: 'none',
      dangerShadow: 'none',
      defaultBorderColor: tokens.borderDefault,
      defaultHoverBorderColor: tokens.textTertiary,
      defaultHoverColor: tokens.textPrimary,
    },
    Input: {
      borderRadius: 12,
      controlHeight: 42,
      activeShadow: `0 0 0 3px color-mix(in srgb, ${tokens.focusRing} 18%, transparent)`,
    },
    Select: {
      borderRadius: 12,
      controlHeight: 42,
      optionSelectedBg: tokens.backgroundMuted,
      optionSelectedFontWeight: 600,
    },
    Switch: {
      colorPrimary: tokens.brandPrimary,
      colorPrimaryHover: tokens.brandPrimaryHover,
    },
    Segmented: {
      itemSelectedBg: tokens.backgroundElevated,
      trackBg: tokens.backgroundMuted,
      borderRadius: 999,
      borderRadiusSM: 999,
    },
    Tag: {
      borderRadiusSM: 999,
    },
    Skeleton: {
      borderRadiusSM: 8,
    },
  };
}
