/** Joins class names, skipping empty values (CSS module lookups may be undefined). */
export function cx(...classNames: (string | false | null | undefined)[]): string {
  return classNames.filter(Boolean).join(' ');
}
