import { MetaMaskInpageProvider } from '@metamask/providers';
import { Contract, providers } from 'ethers';
import { SWRResponse } from 'swr';

export type Web3Dependencies = {
  provider: providers.Web3Provider;
  contract: Contract;
  ethereum: MetaMaskInpageProvider;
};

export type HookFactory<D = any, P = any> = {
  (d: Partial<Web3Dependencies>): HandlerHook<D, P>;
};

export type HandlerHook<D = any, P = any> = (params?: P) => SWRResponse<D>;

/* one liner
export type HookFactory<D = any, P = any> = {
  (d: Partial<Web3Dependencies>): (params: P) => SWRResponse<D>;
};
*/
