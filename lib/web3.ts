import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserProvider, JsonRpcSigner, formatEther } from "ethers";
import type { Web3Controls, Web3State, Web3Status } from "../types/web3";

const SUPPORTED_NETWORKS: Record<number, string> = {
  1: "Ethereum Mainnet",
  11155111: "Sepolia Testnet"
};

function getBrowserProvider(): BrowserProvider | null {
  if (typeof window === "undefined") return null;
  const { ethereum } = window as unknown as { ethereum?: unknown };
  return ethereum ? new BrowserProvider(ethereum) : null;
}

function shortenAddress(address?: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

async function loadAccountData(provider: BrowserProvider, signer: JsonRpcSigner) {
  const [address, network, balanceBigInt] = await Promise.all([
    signer.getAddress(),
    provider.getNetwork(),
    provider.getBalance(await signer.getAddress())
  ]);

  return {
    address,
    chainId: Number(network.chainId),
    networkName: SUPPORTED_NETWORKS[Number(network.chainId)] || network.name,
    balance: formatEther(balanceBigInt)
  };
}

function statusFromError(error: unknown): Web3Status {
  const err = error as { code?: number };
  if (err?.code === 4001) return "rejected";
  return "error";
}

export function useWeb3(): Web3State & Web3Controls & { displayAddress: string } {
  const [state, setState] = useState<Web3State>({ status: "idle" });

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, status: "connecting", error: undefined }));

    const provider = getBrowserProvider();
    if (!provider) {
      setState({ status: "not-installed", error: "MetaMask is not detected. Install it to continue." });
      return;
    }

    try {
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const accountData = await loadAccountData(provider, signer);

      if (!SUPPORTED_NETWORKS[accountData.chainId]) {
        setState({
          status: "wrong-network",
          ...accountData,
          error: "Switch to Ethereum Mainnet or Sepolia to continue."
        });
        return;
      }

      setState({ status: "connected", ...accountData, error: undefined });
    } catch (error) {
      const derivedStatus = statusFromError(error);
      setState({ status: derivedStatus, error: (error as Error).message });
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({ status: "idle" });
  }, []);

  const refreshBalance = useCallback(async () => {
    if (state.status !== "connected") return;
    const provider = getBrowserProvider();
    if (!provider || !state.address) return;
    const balance = await provider.getBalance(state.address);
    setState((prev) => ({ ...prev, balance: formatEther(balance) }));
  }, [state.address, state.status]);

  useEffect(() => {
    const provider = getBrowserProvider();
    if (!provider) return;

    let mounted = true;

    const bootstrap = async () => {
      try {
        const accounts = await provider.listAccounts();
        if (!accounts.length || !mounted) return;
        const signer = await provider.getSigner();
        const accountData = await loadAccountData(provider, signer);
        if (!SUPPORTED_NETWORKS[accountData.chainId]) {
          setState({ status: "wrong-network", ...accountData, error: "Switch to Ethereum Mainnet or Sepolia to continue." });
          return;
        }
        setState({ status: "connected", ...accountData });
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
        const signer = await provider.getSigner();
        const accountData = await loadAccountData(provider, signer);
        setState({ status: "connected", ...accountData });
      } catch (error) {
        setState({ status: "error", error: (error as Error).message });
      }
    };

    const handleChainChanged = () => {
      connect();
    };

    ethereum.on?.("accountsChanged", handleAccountsChanged);
    ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      mounted = false;
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [connect]);

  const displayAddress = useMemo(() => shortenAddress(state.address), [state.address]);

  return { ...state, connect, disconnect, refreshBalance, displayAddress };
}
