import { MetaMaskInpageProvider } from '@metamask/providers';
import { Contract, providers } from 'ethers';

export type Web3Params = {
  ethereum: MetaMaskInpageProvider | null;
  providers: providers.Web3Provider | null;
  contract: Contract | null;
};

export type Web3State = {
  isLoading: boolean;
} & Web3Params;

export const createDefaultState = () => {
  return {
    ethereum: null,
    providers: null,
    contract: null,
    isLoading: true,
  };
};
