"use client";

import { useMemo } from "react";
import { useSolanaContext } from "./SolanaProvider";

export function SolanaPanel() {
  const { status, connect, disconnect, displayAddress, balance, networkName, error, refreshBalance } = useSolanaContext();

  const primaryAction = status === "connected" ? disconnect : connect;
  const primaryLabel = status === "connecting" ? "Connecting…" : status === "connected" ? "Disconnect" : "Connect Phantom";

  const stateMessage = useMemo(() => {
    switch (status) {
      case "not-installed":
        return "Phantom wallet is not installed.";
      case "rejected":
        return "Request was rejected. Try again.";
      case "error":
        return "Something went wrong. Retry or check RPC.";
      case "connecting":
        return "Opening Phantom…";
      case "connected":
        return "You are connected to Solana.";
      default:
        return "Connect Phantom to check your SOL balance.";
    }
  }, [status]);

  return (
    <section className="glass relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 via-emerald-500/20 to-cyan-400/25 opacity-70" aria-hidden />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Wallet</p>
            <h3 className="text-xl font-semibold text-white">Phantom (Solana)</h3>
          </div>
          <button
            onClick={primaryAction}
            disabled={status === "connecting"}
            className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300 px-4 py-2 text-sm font-semibold text-slate transition hover:brightness-110 disabled:opacity-70"
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
            href="https://phantom.app/download"
            target="_blank"
            className="text-sm font-semibold text-emerald-200 underline underline-offset-4"
            rel="noreferrer"
          >
            Get Phantom
          </a>
        )}

        {status === "connected" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat label="Address" value={displayAddress} />
            <Stat label="Network" value={networkName || "Solana"} />
            <Stat
              label="SOL Balance"
              value={balance ? `${balance} SOL` : "—"}
              action={
                <button onClick={refreshBalance} className="text-xs text-emerald-200 underline underline-offset-4">
                  Refresh
                </button>
              }
            />
          </div>
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
