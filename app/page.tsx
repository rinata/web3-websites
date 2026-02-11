"use client";

import { TokenTransferForm } from "../components/TokenTransferForm";
import { WalletConnect } from "../components/WalletConnect";
import { Web3Provider } from "../components/Web3Provider";

export default function Home() {
  return (
    <Web3Provider>
      <main className="min-h-screen bg-slate text-white">
        <div className="relative overflow-hidden bg-grid pb-16 pt-12">
          <div className="absolute inset-0 bg-glow opacity-50" aria-hidden />
          <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6">
            <header className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-aqua">Token Transfer dApp</p>
              <h1 className="text-4xl font-semibold text-white sm:text-5xl">Send ERC-20 tokens with confidence.</h1>
              <p className="max-w-3xl text-lg text-gray-300">
                Connect MetaMask, load token metadata automatically, validate inputs, and track transaction status with ethers v6.
              </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-2">
              <WalletConnect />
              <TokenTransferForm />
            </div>
          </div>
        </div>
      </main>
    </Web3Provider>
  );
}
