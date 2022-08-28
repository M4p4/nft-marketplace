import { HookFactory } from '@_types/hooks';
import useSWR from 'swr';

// deps -> (provider , ethereum,  contract) web3State
export const hookFactory: HookFactory = (deps) => (params) => {
  const swrRes = useSWR('web3/useAccount', () => {
    console.log(deps);
    console.log(params);
    return 'Test User';
  });

  return swrRes;
};

export const useAccount = hookFactory({
  ethereum: undefined,
  provider: undefined,
});
