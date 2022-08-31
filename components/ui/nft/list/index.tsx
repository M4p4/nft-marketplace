import { FunctionComponent } from 'react';
import NftItem from '../item';
import { useListedNfts } from '@hooks/web3';
import { Nft } from '@_types/nft';

const NftList: FunctionComponent = () => {
  const { nfts } = useListedNfts();
  return (
    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
      {nfts.data?.map((nft: Nft) => (
        <div
          key={nft.meta.image}
          className="flex flex-col rounded-lg shadow-lg overflow-hidden"
        >
          <NftItem item={nft} buyNft={nfts.buyNft} />
        </div>
      ))}
    </div>
  );
};

export default NftList;
