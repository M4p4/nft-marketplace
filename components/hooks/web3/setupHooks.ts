import { hookFactory as createAccountHook, useAccountHook } from './useAccount';
import { hookFactory as createNetworkHook, useNetworkHook } from './useNetwork';
import { Web3Dependencies } from '@_types/hooks';

export type Web3Hooks = {
  useAccount: useAccountHook;
  useNetwork: useNetworkHook;
};

export type SetupHooks = {
  (d: Web3Dependencies): Web3Hooks;
};

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
  };
};
