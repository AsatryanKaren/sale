import type { z } from 'zod';

import type { countryCodeSchema, countrySchema } from './schemas';

export type CountryCode = z.infer<typeof countryCodeSchema>;
export type Country = z.infer<typeof countrySchema>;
