import type { ReactNode } from 'react';

import { AppErrorBoundary } from './AppErrorBoundary';
import { AppQueryProvider } from './AppQueryProvider';
import { AppThemeProvider } from './AppThemeProvider';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppErrorBoundary>
      <AppQueryProvider>
        <AppThemeProvider>{children}</AppThemeProvider>
      </AppQueryProvider>
    </AppErrorBoundary>
  );
}
