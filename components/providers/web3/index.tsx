import { createContext, FC, useContext, useState } from 'react';

const Web3Context = createContext<any>(null);

type WebProviderProps = {
  children: React.ReactNode; // 👈️ added type for children
};

const Web3Provider: FC<WebProviderProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState({ test: 'Hello Provider' });

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(Web3Context);
}

export default Web3Provider;
