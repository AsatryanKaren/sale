import type { ThemeConfig } from 'antd';

import type { BrandTokens } from './types';

export function createComponentTokens(tokens: BrandTokens): ThemeConfig['components'] {
  return {
    Button: {
      borderRadius: 10,
      controlHeight: 40,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 16,
      paddingLG: 20,
    },
    Input: {
      borderRadius: 10,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 10,
      controlHeight: 40,
    },
    Tag: {
      borderRadiusSM: 999,
    },
    Layout: {
      bodyBg: tokens.backgroundBase,
      headerBg: tokens.backgroundElevated,
      siderBg: tokens.backgroundElevated,
      triggerBg: tokens.backgroundMuted,
    },
    Menu: {
      itemBorderRadius: 10,
      itemMarginInline: 8,
      itemHeight: 44,
    },
    Skeleton: {
      borderRadiusSM: 10,
    },
  };
}
