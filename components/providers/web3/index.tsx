import { ethers } from 'ethers';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import { createDefaultState, Web3State } from './utils';

const Web3Context = createContext<Web3State>(createDefaultState());

type WebProviderProps = {
  children: React.ReactNode;
};

const Web3Provider: FC<WebProviderProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

  useEffect(() => {
    const initWeb3 = () => {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );

      setWeb3Api({
        ethereum: window.ethereum,
        isLoading: false,
        contract: null,
        provider,
      });
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

export default Web3Provider;
