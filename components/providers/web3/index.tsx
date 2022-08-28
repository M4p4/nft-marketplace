import { setupHooks } from '@hooks/web3/setupHooks';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { ethers } from 'ethers';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import {
  createDefaultState,
  createWeb3State,
  loadContract,
  Web3State,
} from './utils';

const pageReload = () => {
  window.location.reload();
};

const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.on('chainChanged', pageReload);
};

const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.removeListener('chainChanged', pageReload);
};

const Web3Context = createContext<Web3State>(createDefaultState());

type WebProviderProps = {
  children: React.ReactNode;
};

const Web3Provider: FC<WebProviderProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );

        const contract = await loadContract('NftMarket', provider);

        setGlobalListeners(window.ethereum);
        setWeb3Api(
          createWeb3State({
            ethereum: window.ethereum,
            contract,
            provider,
            isLoading: false,
          })
        );
      } catch (err) {
        console.error('Please install a web3 wallet.');
        setWeb3Api((prevApi) =>
          createWeb3State({ ...(prevApi as any), isLoading: false })
        );
      }
    };
    initWeb3();
    return () => {
      removeGlobalListeners(window.ethereum);
    };
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
