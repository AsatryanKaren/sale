import type { ThemeConfig } from 'antd';

import type { BrandTokens } from './types';

export function createComponentTokens(tokens: BrandTokens): ThemeConfig['components'] {
  return {
    Button: {
      borderRadius: 980,
      controlHeight: 36,
      controlHeightSM: 28,
      fontWeight: 500,
      paddingInline: 16,
      paddingInlineSM: 12,
      primaryShadow: 'none',
      defaultShadow: 'none',
    },
    Card: {
      borderRadiusLG: 18,
      paddingLG: 20,
    },
    Input: {
      borderRadius: 12,
      controlHeight: 40,
      activeBorderColor: tokens.brandPrimary,
      hoverBorderColor: tokens.brandSecondary,
    },
    Select: {
      borderRadius: 12,
      controlHeight: 40,
    },
    Tag: {
      borderRadiusSM: 8,
    },
    Layout: {
      bodyBg: tokens.backgroundBase,
      headerBg: 'rgba(251, 251, 253, 0.8)',
      siderBg: tokens.backgroundElevated,
      triggerBg: tokens.backgroundMuted,
    },
    Menu: {
      itemBorderRadius: 980,
      itemMarginInline: 4,
      itemHeight: 36,
      itemSelectedBg: tokens.backgroundMuted,
      itemSelectedColor: tokens.textPrimary,
      itemHoverBg: tokens.backgroundMuted,
      itemColor: tokens.textSecondary,
    },
    Skeleton: {
      borderRadiusSM: 12,
    },
  };
}
