import type { ThemeConfig } from 'antd';

import type { BrandTokens } from './types';

export function createComponentTokens(tokens: BrandTokens): ThemeConfig['components'] {
  return {
    Button: {
      borderRadius: 999,
      controlHeight: 42,
      fontWeight: 700,
      primaryShadow: 'none',
      defaultShadow: 'none',
    },
    Card: {
      borderRadiusLG: 22,
      paddingLG: 22,
    },
    Input: {
      borderRadius: 999,
      controlHeight: 44,
      activeBorderColor: tokens.brandPrimary,
      hoverBorderColor: tokens.brandSecondary,
    },
    Select: {
      borderRadius: 999,
      controlHeight: 44,
    },
    Tag: {
      borderRadiusSM: 999,
    },
    Layout: {
      bodyBg: tokens.backgroundBase,
      headerBg: 'transparent',
      siderBg: 'transparent',
      triggerBg: tokens.backgroundMuted,
    },
    Menu: {
      itemBorderRadius: 14,
      itemMarginInline: 10,
      itemHeight: 46,
      itemSelectedBg: 'rgba(226, 70, 26, 0.12)',
      itemSelectedColor: tokens.brandPrimary,
      itemHoverBg: 'rgba(11, 31, 51, 0.05)',
    },
    Skeleton: {
      borderRadiusSM: 14,
    },
    Badge: {
      colorBgContainer: tokens.saleHot,
    },
  };
}
