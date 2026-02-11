"use client";

import { useMemo } from "react";
import { useWeb3Context } from "./Web3Provider";

export function WalletConnect() {
  const { status, connect, disconnect, displayAddress, networkName, balance, error } = useWeb3Context();

  const buttonLabel = useMemo(() => {
    if (status === "connecting") return "Connecting…";
    if (status === "connected") return "Disconnect";
    return "Connect Wallet";
  }, [status]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case "connected":
        return "Wallet connected";
      case "not-installed":
        return "MetaMask not detected";
      case "rejected":
        return "Request rejected";
      case "error":
        return "Error";
      case "connecting":
        return "Awaiting confirmation…";
      default:
        return "Not connected";
    }
  }, [status]);

  const onClick = status === "connected" ? disconnect : connect;

  return (
    <section className="glass rounded-2xl border border-white/10 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300">Wallet</p>
          <h3 className="text-xl font-semibold text-white">MetaMask (EVM)</h3>
        </div>
        <button
          onClick={onClick}
          disabled={status === "connecting"}
          className="rounded-full bg-gradient-to-r from-electric to-aqua px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-70"
        >
          {buttonLabel}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-gray-200">
        <div className="flex items-center justify-between">
          <span>Status</span>
          <span className="text-gray-100">{statusLabel}</span>
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
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-aqua underline underline-offset-4"
        >
          Install MetaMask
        </a>
      )}

      {status === "connected" && (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Stat label="Address" value={displayAddress} />
          <Stat label="Network" value={networkName || "Unknown"} />
          <Stat label="ETH Balance" value={balance ? `${Number(balance).toFixed(4)} ETH` : "—"} />
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="text-xs text-gray-400">{label}</div>
      <p className="mt-1 text-sm font-semibold text-white">{value || "—"}</p>
    </div>
  );
}
