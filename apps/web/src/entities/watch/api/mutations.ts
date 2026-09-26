import type { CreateWatchRequest, UpdateWatchRequest, Watch } from '@saleradar/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { watchKeys } from './queryKeys';
import { watchApi } from './watchApi';

export function useFollowStoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWatchRequest) => watchApi.followStore(payload),
    onSuccess: (response) => {
      queryClient.setQueryData<Watch[]>(watchKeys.list(), (current) => {
        const existing = current ?? [];
        if (existing.some((watch) => watch.storeId === response.watch.storeId)) {
          return existing;
        }

        return [...existing, response.watch];
      });
      void queryClient.invalidateQueries({ queryKey: watchKeys.all });
    },
  });
}

export function useUpdateWatchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      payload,
    }: {
      storeId: string;
      payload: UpdateWatchRequest;
    }) => watchApi.updateWatch(storeId, payload),
    onSuccess: (response) => {
      queryClient.setQueryData<Watch[]>(watchKeys.list(), (current) => {
        if (!current) {
          return [response.watch];
        }

        return current.map((watch) =>
          watch.storeId === response.watch.storeId ? response.watch : watch,
        );
      });
      void queryClient.invalidateQueries({ queryKey: watchKeys.all });
    },
  });
}

export function useUnfollowStoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeId: string) => watchApi.unfollowStore(storeId),
    onSuccess: (_data, storeId) => {
      queryClient.setQueryData<Watch[]>(watchKeys.list(), (current) =>
        (current ?? []).filter((watch) => watch.storeId !== storeId),
      );
      void queryClient.invalidateQueries({ queryKey: watchKeys.all });
    },
  });
}
