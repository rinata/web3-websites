import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserProvider, formatEther } from "ethers";
import type { Web3Controls, Web3State, Web3Status } from "../types/web3";

function getBrowserProvider(): BrowserProvider | null {
  if (typeof window === "undefined") return null;
  const { ethereum } = window as unknown as { ethereum?: unknown };
  return ethereum ? new BrowserProvider(ethereum) : null;
}

function shortenAddress(address?: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function statusFromError(error: unknown): Web3Status {
  const err = error as { code?: number };
  if (err?.code === 4001) return "rejected";
  return "error";
}

export function useWeb3(): Web3State &
  Web3Controls & { displayAddress: string; provider: BrowserProvider | null } {
  const [state, setState] = useState<Web3State>({ status: "idle" });
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const loadAccountData = useCallback(
    async (currentProvider: BrowserProvider) => {
      const signer = await currentProvider.getSigner();
      const [address, network, balance] = await Promise.all([
        signer.getAddress(),
        currentProvider.getNetwork(),
        currentProvider.getBalance(await signer.getAddress())
      ]);
      setState({
        status: "connected",
        address,
        chainId: Number(network.chainId),
        networkName: network.name,
        balance: formatEther(balance),
        error: undefined
      });
    },
    []
  );

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, status: "connecting", error: undefined }));

    const currentProvider = getBrowserProvider();
    if (!currentProvider) {
      setState({ status: "not-installed", error: "MetaMask is not detected. Install it to continue." });
      return;
    }

    try {
      await currentProvider.send("eth_requestAccounts", []);
      setProvider(currentProvider);
      await loadAccountData(currentProvider);
    } catch (error) {
      setState({ status: statusFromError(error), error: (error as Error).message });
    }
  }, [loadAccountData]);

  const disconnect = useCallback(() => {
    setState({ status: "idle" });
    setProvider(null);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (state.status !== "connected" || !provider || !state.address) return;
    const balance = await provider.getBalance(state.address);
    setState((prev) => ({ ...prev, balance: formatEther(balance) }));
  }, [provider, state.address, state.status]);

  useEffect(() => {
    const currentProvider = getBrowserProvider();
    if (!currentProvider) return;
    setProvider(currentProvider);

    let mounted = true;

    const bootstrap = async () => {
      try {
        const accounts = await currentProvider.listAccounts();
        if (!accounts.length || !mounted) return;
        await loadAccountData(currentProvider);
      } catch {
        // ignore bootstrap errors
      }
    };

    bootstrap();

    const ethereum = (window as unknown as { ethereum?: { on?: Function; removeListener?: Function } }).ethereum;
    if (!ethereum || typeof ethereum.on !== "function") return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (!accounts.length) {
        setState({ status: "idle" });
        return;
      }
      try {
        await loadAccountData(currentProvider);
      } catch (error) {
        setState({ status: "error", error: (error as Error).message });
      }
    };

    const handleChainChanged = () => {
      loadAccountData(currentProvider);
    };

    ethereum.on?.("accountsChanged", handleAccountsChanged);
    ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      mounted = false;
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [loadAccountData]);

  const displayAddress = useMemo(() => shortenAddress(state.address), [state.address]);

  return { ...state, provider, connect, disconnect, refreshBalance, displayAddress };
}
