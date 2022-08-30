import { HookFactory } from '@_types/hooks';
import { Nft } from '@_types/nft';
import useSWR from 'swr';

type useListedNftsResponse = {};

type ListedNftsHookFactory = HookFactory<any, useListedNftsResponse>;

export type useListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? 'web3/useListedNfts' : null,
      async () => {
        const nfts = [] as Nft[];
        const coreNfts = await contract!.getAllNftsOnSale();

        return nfts;
      }
    );

    return {
      ...swr,
      data: data || [],
    };
  };
