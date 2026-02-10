import { useCallback, useEffect, useMemo, useState } from "react";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import type { SolanaControls, SolanaState, SolanaStatus } from "../types/solana";

type PhantomProvider = {
  isPhantom?: boolean;
  publicKey?: PublicKey;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  off?: (event: string, handler: (...args: unknown[]) => void) => void;
};

const NETWORK = "devnet";
const NETWORK_NAME = "Solana Devnet";

function getPhantom(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  const provider = (window as unknown as { solana?: PhantomProvider }).solana;
  if (provider?.isPhantom) return provider;
  return null;
}

function shorten(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

function statusFromError(error: unknown): SolanaStatus {
  const err = error as { code?: number };
  if (err?.code === 4001) return "rejected"; // Phantom user rejected
  return "error";
}

export function useSolana(): SolanaState & SolanaControls & { displayAddress: string } {
  const [state, setState] = useState<SolanaState>({ status: "idle" });

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, status: "connecting", error: undefined }));
    const phantom = getPhantom();
    if (!phantom) {
      setState({ status: "not-installed", error: "Phantom wallet is not detected." });
      return;
    }

    try {
      const { publicKey } = await phantom.connect();
      const address = publicKey.toBase58();
      const connection = new Connection(clusterApiUrl(NETWORK));
      const balanceLamports = await connection.getBalance(publicKey);
      setState({
        status: "connected",
        address,
        balance: (balanceLamports / LAMPORTS_PER_SOL).toFixed(4),
        networkName: NETWORK_NAME,
        error: undefined
      });
    } catch (error) {
      setState({ status: statusFromError(error), error: (error as Error).message });
    }
  }, []);

  const disconnect = useCallback(async () => {
    const phantom = getPhantom();
    if (!phantom) {
      setState({ status: "not-installed", error: "Phantom wallet is not detected." });
      return;
    }
    try {
      await phantom.disconnect();
    } catch {
      // ignore disconnect errors
    }
    setState({ status: "idle" });
  }, []);

  const refreshBalance = useCallback(async () => {
    if (state.status !== "connected" || !state.address) return;
    const phantom = getPhantom();
    if (!phantom) return;
    const connection = new Connection(clusterApiUrl(NETWORK));
    const balanceLamports = await connection.getBalance(new PublicKey(state.address));
    setState((prev) => ({ ...prev, balance: (balanceLamports / LAMPORTS_PER_SOL).toFixed(4) }));
  }, [state.address, state.status]);

  useEffect(() => {
    const phantom = getPhantom();
    if (!phantom || typeof phantom.on !== "function") return;

    const handleAccountChange = (pk: PublicKey | null) => {
      if (!pk) {
        setState({ status: "idle" });
        return;
      }
      setState((prev) => ({ ...prev, address: pk.toBase58(), status: "connected" }));
      refreshBalance();
    };

    const handleDisconnect = () => {
      setState({ status: "idle" });
    };

    phantom.on("accountChanged", handleAccountChange);
    phantom.on("disconnect", handleDisconnect);

    return () => {
      phantom.off?.("accountChanged", handleAccountChange);
      phantom.off?.("disconnect", handleDisconnect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayAddress = useMemo(() => shorten(state.address), [state.address]);

  return { ...state, connect, disconnect, refreshBalance, displayAddress };
}
