import { MetaMaskInpageProvider } from '@metamask/providers';
import { Contract, providers } from 'ethers';
import { SWRResponse } from 'swr';

export type Web3Dependencies = {
  provider: providers.Web3Provider;
  contract: Contract;
  ethereum: MetaMaskInpageProvider;
};

export type HandlerHook = (params: any) => SWRResponse;

export type HookFactory = {
  (d: Partial<Web3Dependencies>): HandlerHook;
};
