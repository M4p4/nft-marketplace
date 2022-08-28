import { MetaMaskInpageProvider } from '@metamask/providers';
import { Contract, providers } from 'ethers';
import { SWRResponse } from 'swr';

export type Web3Dependencies = {
  provider: providers.Web3Provider;
  contract: Contract;
  ethereum: MetaMaskInpageProvider;
  isLoading: boolean;
};

export type HookFactory<D = any, R = any, P = any> = {
  (d: Partial<Web3Dependencies>): HandlerHook<D, R, P>;
};

export type HandlerHook<D = any, R = any, P = any> = (
  params?: P
) => SWRResponse<D> & R;

/* one liner
export type HookFactory<D = any, P = any> = {
  (d: Partial<Web3Dependencies>): (params: P) => SWRResponse<D>;
};
*/
