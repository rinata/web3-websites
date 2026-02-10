"use client";

import { createContext, useContext } from "react";
import { useSolana } from "../lib/solana";

type SolanaContextValue = ReturnType<typeof useSolana>;

const SolanaContext = createContext<SolanaContextValue | null>(null);

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const value = useSolana();
  return <SolanaContext.Provider value={value}>{children}</SolanaContext.Provider>;
}

export function useSolanaContext(): SolanaContextValue {
  const ctx = useContext(SolanaContext);
  if (!ctx) {
    throw new Error("useSolanaContext must be used within a SolanaProvider");
  }
  return ctx;
}
