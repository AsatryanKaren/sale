import type {
  CheckoutRequest,
  LoginRequest,
  SessionResponse,
  SignupRequest,
} from '@saleradar/contracts';
import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';

import { sessionKeys } from './queryKeys';
import { sessionApi } from './sessionApi';

function useSessionMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<SessionResponse>,
  onSettled?: (queryClient: QueryClient) => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (session) => {
      queryClient.setQueryData(sessionKeys.current(), session);
      onSettled?.(queryClient);
    },
  });
}

/** Signing in or up changes whose data every cached query belongs to. */
function resetUserData(queryClient: QueryClient) {
  queryClient.removeQueries({
    predicate: (query) => query.queryKey[0] !== sessionKeys.all[0],
  });
}

export function useLoginMutation() {
  return useSessionMutation((payload: LoginRequest) => sessionApi.login(payload), resetUserData);
}

export function useSignupMutation() {
  return useSessionMutation((payload: SignupRequest) => sessionApi.signup(payload), resetUserData);
}

export function useCheckoutMutation() {
  return useSessionMutation(
    (payload: CheckoutRequest) => sessionApi.checkout(payload),
    (queryClient) => {
      // Catalog queries that failed with "payment required" can now succeed.
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] !== sessionKeys.all[0],
      });
    },
  );
}

export function useCancelSubscriptionMutation() {
  return useSessionMutation(() => sessionApi.cancel());
}

export function useResumeSubscriptionMutation() {
  return useSessionMutation(() => sessionApi.resume());
}

export function useExpireTrialForDemoMutation() {
  return useSessionMutation(() => sessionApi.expireTrialForDemo());
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sessionApi.logout(),
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(sessionKeys.current(), null);
    },
  });
}
