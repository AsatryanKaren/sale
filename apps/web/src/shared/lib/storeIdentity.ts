export function getStoreInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return '?';
  }

  const first = parts[0];
  if (!first) {
    return '?';
  }

  if (parts.length === 1) {
    return first.slice(0, 2).toUpperCase();
  }

  const second = parts[1];
  if (!second) {
    return first.slice(0, 2).toUpperCase();
  }

  return `${first[0] ?? ''}${second[0] ?? ''}`.toUpperCase();
}

/** Stable 0-359 hue derived from a store name, used to tint its monogram. */
export function getStoreHue(name: string): number {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360;
  }

  return hash;
}
