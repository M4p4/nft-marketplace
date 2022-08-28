import { HookFactory } from '@_types/hooks';
import useSWR from 'swr';

type AccountHookFactory = HookFactory<string>;

export type useAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory =
  ({ provider }) =>
  (params) => {
    const swrRes = useSWR(
      provider ? 'web3/useAccount' : null,
      async () => {
        const accounts = await provider!.listAccounts();
        const account = accounts[0];

        if (!account) {
          throw 'Please connect to website with your web3 wallet!';
        }

        return account;
      },
      {
        revalidateOnFocus: false,
      }
    );

    return swrRes;
  };
