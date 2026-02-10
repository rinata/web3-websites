"use client";

import { WalletPanel } from "./WalletPanel";
import { SolanaPanel } from "./SolanaPanel";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-glow opacity-50" aria-hidden />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-20 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-aqua">
            Next.js • ethers v6 • Tailwind
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Ship a bold Web3 experience with{" "}
            <span className="gradient-text">wallet-ready UI</span>.
          </h1>
          <p className="max-w-2xl text-lg text-gray-300">
            A responsive starter that connects to MetaMask, handles network edge cases, and gives your users confident on-chain interactions.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#features"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Explore Features
            </a>
            <a
              href="#roadmap"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40"
            >
              View Roadmap
            </a>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_0_6px_rgba(74,222,128,0.1)]" />
              Live network checks
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-aqua shadow-[0_0_0_6px_rgba(0,224,255,0.1)]" />
              Ready for Mainnet, Sepolia & Solana Devnet
            </div>
          </div>
        </div>
        <div className="w-full max-w-md space-y-4">
          <WalletPanel />
          <SolanaPanel />
        </div>
      </div>
    </section>
  );
}
