import { FC } from 'react';

type WalletbarProps = {
  isLoading: boolean;
  isInstalled: boolean;
  account?: string;
  connect: () => void;
};

const Walletbar: FC<WalletbarProps> = ({
  isLoading,
  isInstalled,
  account,
  connect,
}) => {
  return (
    <button
      onClick={() => {
        connect();
      }}
      type="button"
      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
    >
      Connect Wallet
    </button>
  );
};

export default Walletbar;
