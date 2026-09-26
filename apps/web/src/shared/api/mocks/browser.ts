import { setupWorker } from 'msw/browser';

import { mockHandlers } from './handlers';

export async function enableMockApi(): Promise<void> {
  const worker = setupWorker(...mockHandlers);
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
  });
}
