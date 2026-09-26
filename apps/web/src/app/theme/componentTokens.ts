import type { ThemeConfig } from 'antd';

import type { BrandTokens } from './types';

export function createComponentTokens(tokens: BrandTokens): ThemeConfig['components'] {
  return {
    Button: {
      borderRadius: 12,
      controlHeight: 40,
      fontWeight: 700,
      primaryShadow: 'none',
      defaultShadow: 'none',
    },
    Card: {
      borderRadiusLG: 14,
      paddingLG: 20,
    },
    Input: {
      borderRadius: 12,
      controlHeight: 42,
      activeBorderColor: tokens.brandPrimary,
      hoverBorderColor: tokens.brandSecondary,
    },
    Select: {
      borderRadius: 12,
      controlHeight: 42,
    },
    Tag: {
      borderRadiusSM: 8,
    },
    Layout: {
      bodyBg: tokens.backgroundBase,
      headerBg: '#121316',
      siderBg: '#121316',
      triggerBg: tokens.backgroundMuted,
    },
    Menu: {
      darkItemBg: '#121316',
      darkSubMenuItemBg: '#121316',
      itemBorderRadius: 10,
      itemMarginInline: 8,
      itemHeight: 42,
      darkItemSelectedBg: 'rgba(225, 29, 72, 0.16)',
      darkItemSelectedColor: '#FFFFFF',
      darkItemHoverBg: 'rgba(255, 255, 255, 0.06)',
      darkItemColor: 'rgba(248, 250, 252, 0.72)',
    },
    Skeleton: {
      borderRadiusSM: 10,
    },
  };
}
