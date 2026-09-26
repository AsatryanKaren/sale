export const watchKeys = {
  all: ['following'] as const,
  lists: () => [...watchKeys.all, 'list'] as const,
  list: () => [...watchKeys.lists()] as const,
};
