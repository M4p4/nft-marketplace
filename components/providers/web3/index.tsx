import { setupHooks } from '@hooks/web3/setupHooks';
import { ethers } from 'ethers';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import {
  createDefaultState,
  createWeb3State,
  loadContract,
  Web3State,
} from './utils';

const Web3Context = createContext<Web3State>(createDefaultState());

type WebProviderProps = {
  children: React.ReactNode;
};

const Web3Provider: FC<WebProviderProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

  useEffect(() => {
    const initWeb3 = async () => {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const contract = await loadContract('NftMarket', provider);
      setWeb3Api(
        createWeb3State({
          ethereum: window.ethereum,
          contract,
          provider,
          isLoading: false,
        })
      );
    };
    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(Web3Context);
}

export function useHooks() {
  const { hooks } = useWeb3();
  return hooks;
}

export default Web3Provider;