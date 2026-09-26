import { App as AntApp, ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

import { defaultTheme } from '@/app/theme';

type AppThemeProviderProps = {
  children: ReactNode;
};

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <ConfigProvider theme={defaultTheme}>
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
}
