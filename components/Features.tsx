const items = [
  {
    title: "App Router + TypeScript",
    description: "Modern Next.js 14 foundation with strict types and fast routing.",
    accent: "from-electric to-aqua"
  },
  {
    title: "Wallet UX States",
    description: "Handles missing MetaMask, wrong network, rejections, and RPC errors gracefully.",
    accent: "from-cyan-400 to-emerald-300"
  },
  {
    title: "Ethers v6 Ready",
    description: "BrowserProvider flow with live balance fetch and network labeling.",
    accent: "from-amber-300 to-orange-500"
  },
  {
    title: "Solana Included",
    description: "Phantom connect, SOL balance on devnet, same UX states and refresh.",
    accent: "from-green-400 to-emerald-500"
  },
  {
    title: "Tailwind Design System",
    description: "Responsive, glassmorphism cards, gradient accents, and grid background.",
    accent: "from-pink-400 to-electric"
  }
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-aqua">Features</p>
          <h2 className="text-3xl font-semibold text-white">Built for real Web3 shipping</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-300">Wallet-first</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.title} className="glass relative overflow-hidden rounded-2xl p-6">
            <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-20`} aria-hidden />
            <div className="relative space-y-3">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-gray-300">{item.description}</p>
              <div className="text-xs text-gray-400">Prewired components + utilities</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
