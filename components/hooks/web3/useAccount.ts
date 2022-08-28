import { HookFactory } from '@_types/hooks';
import { useEffect } from 'react';
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

    useEffect(() => {
      ethereum?.on('accountsChanged', handleAccountsChanged);
      return () => {
        ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      };
    });

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        console.error('Please connect to Metamask!');
      } else if (accounts[0] !== swrRes.data) {
        alert('Account has been changed!');
      }
    };

    const connect = async () => {
      try {
        ethereum?.request({ method: 'eth_requestAccounts' });
      } catch (err) {
        console.error(err);
      }
    };

    return { ...swrRes, connect };
  };
