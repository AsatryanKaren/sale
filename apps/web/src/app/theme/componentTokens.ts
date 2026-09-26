import type { ThemeConfig } from 'antd';

import type { BrandTokens } from './types';

export function createComponentTokens(tokens: BrandTokens): ThemeConfig['components'] {
  return {
    Button: {
      borderRadius: 8,
      controlHeight: 30,
      controlHeightSM: 26,
      fontWeight: 600,
      paddingInline: 12,
      paddingInlineSM: 8,
      primaryShadow: 'none',
      defaultShadow: 'none',
      contentFontSize: 12,
      contentFontSizeSM: 12,
    },
    Card: {
      borderRadiusLG: 12,
      paddingLG: 14,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 32,
      activeBorderColor: tokens.brandPrimary,
      hoverBorderColor: tokens.brandSecondary,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 32,
    },
    Tag: {
      borderRadiusSM: 6,
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
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemHeight: 38,
      darkItemSelectedBg: 'rgba(225, 29, 72, 0.16)',
      darkItemSelectedColor: '#FFFFFF',
      darkItemHoverBg: 'rgba(255, 255, 255, 0.06)',
      darkItemColor: 'rgba(248, 250, 252, 0.72)',
    },
    Skeleton: {
      borderRadiusSM: 8,
    },
  };
}
