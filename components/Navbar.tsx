"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useWeb3Context } from "./Web3Provider";

export function Navbar() {
  const { status, connect, disconnect, displayAddress, networkName } = useWeb3Context();

  const buttonLabel = useMemo(() => {
    if (status === "connecting") return "Connecting…";
    if (status === "connected") return "Disconnect";
    return "Connect Wallet";
  }, [status]);

  const sublabel = useMemo(() => {
    if (status === "connected") return networkName || "Connected";
    if (status === "wrong-network") return "Wrong network";
    if (status === "not-installed") return "Install MetaMask";
    if (status === "rejected") return "Request rejected";
    return "";
  }, [networkName, status]);

  const onClick = status === "connected" ? disconnect : connect;

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="h-3 w-3 rounded-full bg-aqua shadow-[0_0_15px_rgba(0,224,255,0.9)]" />
          Inata Web3
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-gray-300 md:flex">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#roadmap" className="hover:text-white">Roadmap</a>
          <a href="#team" className="hover:text-white">Team</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          {displayAddress && status === "connected" && (
            <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200 md:block">
              {displayAddress}
            </div>
          )}
          <button
            onClick={onClick}
            disabled={status === "connecting"}
            className="rounded-full bg-gradient-to-r from-electric to-aqua px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-70"
          >
            {buttonLabel}
          </button>
          {sublabel && <span className="hidden text-xs text-gray-400 md:inline">{sublabel}</span>}
        </div>
      </div>
    </header>
  );
}
