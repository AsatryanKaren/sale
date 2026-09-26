import type { z } from 'zod';

import type {
  saleHistoryEventSchema,
  saleKindSchema,
  saleSchema,
  saleSnapshotSchema,
  saleStatusSchema,
  storeSalesResponseSchema,
} from './schemas';

export type SaleKind = z.infer<typeof saleKindSchema>;
export type SaleStatus = z.infer<typeof saleStatusSchema>;
export type Sale = z.infer<typeof saleSchema>;
export type SaleSnapshot = z.infer<typeof saleSnapshotSchema>;
export type SaleHistoryEvent = z.infer<typeof saleHistoryEventSchema>;
export type StoreSalesResponse = z.infer<typeof storeSalesResponseSchema>;
