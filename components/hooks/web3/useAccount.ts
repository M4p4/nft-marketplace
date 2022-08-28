import { HookFactory } from '@_types/hooks';
import useSWR from 'swr';

type useAccountResponse = { connect: () => void };

type AccountHookFactory = HookFactory<string, useAccountResponse>;

export type useAccountHook = ReturnType<AccountHookFactory>;

export const hookFactory: AccountHookFactory =
  ({ provider, ethereum }) =>
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

    const connect = async () => {
      try {
        ethereum?.request({ method: 'eth_requestAccounts' });
      } catch (err) {
        console.error(err);
      }
    };

    return { ...swrRes, connect };
  };
