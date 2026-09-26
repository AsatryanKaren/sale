import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';
import { appConfig } from '@/shared/config';

import '@/app/styles/global.css';

async function prepareApp(): Promise<void> {
  if (appConfig.useMockApi) {
    const { enableMockApi } = await import('@/shared/api/mocks');
    await enableMockApi();
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

void prepareApp().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
