import { HookFactory } from '@_types/hooks';
import { useEffect } from 'react';
import useSWR from 'swr';

type useNetworkResponse = {
  isLoading: boolean;
  isSupported: boolean;
  targetNetwork: string;
  isConnected: boolean;
};

const NETWORKS: { [k: string]: string } = {
  1: 'Ethereum Main Network',
  3: 'Ropsten Test Network',
  4: 'Rinkeby Test Network',
  5: 'Goerli Test Network',
  42: 'Kovan Test Network',
  56: 'Binance Smart Chain',
  1337: 'Ganache',
};

const targetNetworkName = NETWORKS[process.env.NEXT_PUBLIC_CHAIN_ID as string];

type NetworkHookFactory = HookFactory<string, useNetworkResponse>;

export type useNetworkHook = ReturnType<NetworkHookFactory>;

export const hookFactory: NetworkHookFactory =
  ({ provider, isLoading }) =>
  () => {
    const { data, isValidating, ...swr } = useSWR(
      provider ? 'web3/useNetwork' : null,
      async () => {
        const chainId = (await provider!.getNetwork()).chainId;

        if (!chainId) {
          throw "Can't recieve network please refresh your browser!";
        }

        return NETWORKS[chainId];
      },
      {
        revalidateOnFocus: false,
      }
    );

    const isSupported = targetNetworkName === data;

    return {
      ...swr,
      data,
      isValidating,
      isLoading: isLoading as boolean,
      isSupported,
      isConnected: !isLoading && isSupported,
      targetNetwork: targetNetworkName,
    };
  };
