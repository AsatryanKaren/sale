export const storeKeys = {
  all: ['stores'] as const,
  lists: () => [...storeKeys.all, 'list'] as const,
  list: (filters: Record<string, string | boolean | undefined> = {}) =>
    [...storeKeys.lists(), filters] as const,
  details: () => [...storeKeys.all, 'detail'] as const,
  detail: (slug: string) => [...storeKeys.details(), slug] as const,
  sales: (slug: string) => [...storeKeys.detail(slug), 'sales'] as const,
};
