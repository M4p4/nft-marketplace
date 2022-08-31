import { HookFactory } from '@_types/hooks';
import { Nft } from '@_types/nft';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import useSWR from 'swr';

type useListedNftsResponse = {
  buyNft: (tokenId: number, value: number) => Promise<void>;
};

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

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.tokenURI(item.tokenId);
          const metaRes = await fetch(tokenURI);
          const meta = await metaRes.json();

          nfts.push({
            price: parseFloat(ethers.utils.formatEther(item.price)),
            creator: item.creator,
            tokenId: item.tokenId.toNumber(),
            isListed: item.isListed,
            meta,
          });
        }
        return nfts;
      }
    );

    const _contract = contract;
    const buyNft = useCallback(
      async (tokenId: number, value: number) => {
        try {
          const result = await _contract?.buyNft(tokenId, {
            value: ethers.utils.parseEther(value.toString()),
          });

          await result?.wait();
          alert('You bought a NFT. See profile page!');
        } catch (e: any) {
          console.log(e.message);
        }
      },
      [_contract]
    );

    return {
      ...swr,
      buyNft,
      data: data || [],
    };
  };
