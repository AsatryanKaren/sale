/** Postgres drivers return timestamptz as Date; the API contract speaks ISO strings. */
export function toIso(value: Date | string): string {
  return (value instanceof Date ? value : new Date(value)).toISOString();
}

export function toIsoOrNull(value: Date | string | null): string | null {
  return value === null ? null : toIso(value);
}
