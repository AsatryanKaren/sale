import type { ThemeConfig } from 'antd';

import type { BrandTokens } from './types';

export function createComponentTokens(tokens: BrandTokens): ThemeConfig['components'] {
  return {
    Button: {
      borderRadius: 10,
      controlHeight: 40,
      fontWeight: 600,
      primaryShadow: 'none',
      defaultShadow: 'none',
    },
    Card: {
      borderRadiusLG: 12,
      paddingLG: 20,
    },
    Input: {
      borderRadius: 10,
      controlHeight: 40,
      activeBorderColor: tokens.brandPrimary,
      hoverBorderColor: tokens.brandSecondary,
    },
    Select: {
      borderRadius: 10,
      controlHeight: 40,
    },
    Tag: {
      borderRadiusSM: 6,
    },
    Layout: {
      bodyBg: tokens.backgroundBase,
      headerBg: tokens.backgroundElevated,
      siderBg: tokens.backgroundElevated,
      triggerBg: tokens.backgroundMuted,
    },
    Menu: {
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemHeight: 40,
      itemSelectedBg: tokens.backgroundMuted,
      itemSelectedColor: tokens.brandPrimary,
      itemHoverBg: tokens.borderSubtle,
    },
    Skeleton: {
      borderRadiusSM: 8,
    },
  };
}
