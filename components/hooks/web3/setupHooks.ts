import { hookFactory as createAccountHook, useAccountHook } from './useAccount';
import { hookFactory as createNetworkHook, useNetworkHook } from './useNetwork';
import { Web3Dependencies } from '@_types/hooks';
import {
  hookFactory as createListedNftsHook,
  useListedNftsHook,
} from './useListedNfts';
import {
  hookFactory as createOwnedNftsHook,
  useOwnedNftsHook,
} from './useOwnedNfts';

export type Web3Hooks = {
  useAccount: useAccountHook;
  useNetwork: useNetworkHook;
  useListedNfts: useListedNftsHook;
  useOwnedNfts: useOwnedNftsHook;
};

export type SetupHooks = {
  (d: Web3Dependencies): Web3Hooks;
};

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
    useListedNfts: createListedNftsHook(deps),
    useOwnedNfts: createOwnedNftsHook(deps),
  };
};
