import { HookFactory } from '@_types/hooks';
import { useEffect } from 'react';
import useSWR from 'swr';

type useNetworkResponse = {
  isLoading: boolean;
};

type NetworkHookFactory = HookFactory<string, useNetworkResponse>;

export type useNetworkHook = ReturnType<NetworkHookFactory>;

export const hookFactory: NetworkHookFactory =
  ({ provider, isLoading }) =>
  () => {
    const { data, isValidating, ...swr } = useSWR(
      provider ? 'web3/useNetwork' : null,
      async () => {
        return 'Testing Network';
      },
      {
        revalidateOnFocus: false,
      }
    );

    return {
      ...swr,
      data,
      isValidating,
      isLoading: isLoading || isValidating,
    };
  };
