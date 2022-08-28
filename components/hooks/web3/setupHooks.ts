import { hookFactory as createAccountHook, useAccountHook } from './useAccount';
import { Web3Dependencies } from '@_types/hooks';

export type Web3Hooks = {
  useAccount: useAccountHook;
};

export type SetupHooks = {
  (d: Web3Dependencies): Web3Hooks;
};

export const setupHooks: SetupHooks = (deps) => {
  return { useAccount: createAccountHook(deps) };
};
