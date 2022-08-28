import { HookFactory } from '@_types/hooks';
import useSWR from 'swr';

type AccountHookFactory = HookFactory<string, string>;

export type useAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory = (deps) => (params) => {
  const swrRes = useSWR('web3/useAccount', () => {
    console.log(deps);
    console.log(params);
    return 'Test User';
  });

  return swrRes;
};
