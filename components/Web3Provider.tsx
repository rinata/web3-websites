"use client";

import { createContext, useContext } from "react";
import { useWeb3 } from "../lib/web3";

type Web3ContextValue = ReturnType<typeof useWeb3>;

const Web3Context = createContext<Web3ContextValue | null>(null);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const value = useWeb3();
  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3Context(): Web3ContextValue {
  const ctx = useContext(Web3Context);
  if (!ctx) {
    throw new Error("useWeb3Context must be used within a Web3Provider");
  }
  return ctx;
}
