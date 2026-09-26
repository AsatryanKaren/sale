import { z } from 'zod';

import { SUPPORTED_COUNTRY_CODES } from './constants';

export const countryCodeSchema = z.enum(SUPPORTED_COUNTRY_CODES);

export const countrySchema = z.object({
  code: countryCodeSchema,
  name: z.string().min(1),
});
