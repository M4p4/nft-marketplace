import { HookFactory } from '@_types/hooks';
import { Nft } from '@_types/nft';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import useSWR from 'swr';

type useOwnedNftsResponse = {
  listNft: (tokenId: number, price: number) => Promise<void>;
};

type OwnedNftsHookFactory = HookFactory<any, useOwnedNftsResponse>;

export type useOwnedNftsHook = ReturnType<OwnedNftsHookFactory>;

export const hookFactory: OwnedNftsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? 'web3/useOwnedNfts' : null,
      async () => {
        const nfts = [] as Nft[];
        const coreNfts = await contract!.getOwnedNfts();

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
    const listNft = useCallback(
      async (tokenId: number, price: number) => {
        try {
          const listingPrice = await _contract?.listingPrice();
          const result = await _contract?.placeNftOnSale(
            tokenId,
            ethers.utils.parseEther(price.toString()),
            {
              value: listingPrice,
            }
          );

          await result?.wait();
          alert('Item has been listed!');
        } catch (e: any) {
          console.log(e.message);
        }
      },
      [_contract]
    );

    return {
      ...swr,
      listNft,
      data: data || [],
    };
  };
