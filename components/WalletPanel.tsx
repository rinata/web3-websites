"use client";

import { useMemo } from "react";
import { useWeb3Context } from "./Web3Provider";

export function WalletPanel() {
  const { status, connect, disconnect, displayAddress, balance, networkName, error, refreshBalance } = useWeb3Context();

  const primaryAction = status === "connected" ? disconnect : connect;
  const primaryLabel = status === "connecting" ? "Connecting…" : status === "connected" ? "Disconnect" : "Connect Wallet";

  const stateMessage = useMemo(() => {
    switch (status) {
      case "not-installed":
        return "MetaMask is not installed. Add the extension to continue.";
      case "wrong-network":
        return "Switch to Ethereum Mainnet or Sepolia to continue.";
      case "rejected":
        return "Request was rejected. Please try again.";
      case "error":
        return "Something went wrong. Retry or check RPC settings.";
      case "connecting":
        return "Opening MetaMask…";
      case "connected":
        return "You are connected.";
      default:
        return "Connect your wallet to view balances and start building.";
    }
  }, [status]);

  return (
    <section className="glass relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-xl">
      <div className="absolute inset-0 bg-glow opacity-60" aria-hidden />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Wallet</p>
            <h3 className="text-xl font-semibold text-white">MetaMask</h3>
          </div>
          <button
            onClick={primaryAction}
            disabled={status === "connecting"}
            className="rounded-full bg-gradient-to-r from-electric to-aqua px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-70"
          >
            {primaryLabel}
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-gray-200">
          <div className="flex items-center justify-between">
            <span>Status</span>
            <span className="text-gray-100">{stateMessage}</span>
          </div>
          {error && (
            <p className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          )}
        </div>

        {status === "not-installed" && (
          <a
            href="https://metamask.io/download/"
            target="_blank"
            className="text-sm font-semibold text-aqua underline underline-offset-4"
            rel="noreferrer"
          >
            Get MetaMask
          </a>
        )}

        {status === "connected" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat label="Address" value={displayAddress} />
            <Stat label="Network" value={networkName || "Unknown"} />
            <Stat
              label="ETH Balance"
              value={balance ? `${Number(balance).toFixed(4)} ETH` : "—"}
              action={
                <button onClick={refreshBalance} className="text-xs text-aqua underline underline-offset-4">
                  Refresh
                </button>
              }
            />
          </div>
        )}

        {status === "wrong-network" && (
          <p className="text-sm text-orange-200">
            Wrong network detected. Open MetaMask and select Ethereum Mainnet or Sepolia, then reconnect.
          </p>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value, action }: { label: string; value?: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{label}</span>
        {action}
      </div>
      <p className="mt-2 text-sm font-semibold text-white">{value || "—"}</p>
    </div>
  );
}
