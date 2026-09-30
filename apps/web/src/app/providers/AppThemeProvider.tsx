import { App as AntApp, ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

import { ThemeCssVariables, defaultTheme } from '@/app/theme';

type AppThemeProviderProps = {
  children: ReactNode;
};

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <ConfigProvider theme={defaultTheme}>
      <ThemeCssVariables />
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
}
