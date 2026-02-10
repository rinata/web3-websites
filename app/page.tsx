"use client";

import { FAQ } from "../components/FAQ";
import { Features } from "../components/Features";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Navbar } from "../components/Navbar";
import { Roadmap } from "../components/Roadmap";
import { Team } from "../components/Team";
import { SolanaProvider } from "../components/SolanaProvider";
import { Web3Provider } from "../components/Web3Provider";

export default function Home() {
  return (
    <Web3Provider>
      <SolanaProvider>
        <main className="min-h-screen bg-slate text-white">
          <Navbar />
          <Hero />
          <Features />
          <Roadmap />
          <Team />
          <FAQ />
          <Footer />
        </main>
      </SolanaProvider>
    </Web3Provider>
  );
}
