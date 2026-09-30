import { createRoot, type Root } from 'react-dom/client';
import { ConfigProvider, App as AntApp } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import { ThemeCssVariables, defaultTheme } from '@/app/theme';
import { stories } from './stories';

import '@fontsource-variable/geist';
import '@/app/styles/global.css';

type MountArgs = {
  story: string;
  props?: Record<string, unknown>;
};

declare global {
  interface Window {
    mount: (args: MountArgs) => Promise<void>;
    unmount: () => Promise<void>;
  }
}

let root: Root | null = null;
let queryClient: QueryClient | null = null;

function ensureRoot(): Root {
  const element = document.getElementById('root');
  if (!element) {
    throw new Error('Gallery root element was not found.');
  }

  root ??= createRoot(element);
  return root;
}

window.mount = async ({ story, props = {} }) => {
  const Story = stories[story];
  if (!Story) {
    throw new Error(`Unknown story: ${story}`);
  }

  queryClient ??= new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  ensureRoot().render(
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={defaultTheme}>
        <ThemeCssVariables />
        <AntApp>
          <MemoryRouter>
            <Story {...props} />
          </MemoryRouter>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>,
  );
};

window.unmount = async () => {
  if (root) {
    root.unmount();
    root = null;
  }
};
