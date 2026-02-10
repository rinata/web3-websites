const items = [
  {
    quarter: "Q1",
    title: "MVP Launch",
    detail: "Wallet connection, network gating, and on-chain read helpers.",
    status: "Done"
  },
  {
    quarter: "Q2",
    title: "Transactions",
    detail: "Gas estimation helpers, retry flows, and pending toasts.",
    status: "In Progress"
  },
  {
    quarter: "Q3",
    title: "Multi-chain",
    detail: "Configurable chain map with auto RPC fallbacks and price oracles.",
    status: "Planned"
  }
];

export function Roadmap() {
  return (
    <section id="roadmap" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-aqua">Roadmap</p>
        <h2 className="text-3xl font-semibold text-white">Where this starter is headed</h2>
      </div>
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={item.title} className="glass relative overflow-hidden rounded-2xl p-6">
            <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-aqua/60 via-white/10 to-transparent" aria-hidden />
            <div className="relative grid gap-4 sm:grid-cols-6 sm:items-center">
              <div className="sm:col-span-1">
                <div className="text-sm uppercase tracking-[0.2em] text-gray-400">{item.quarter} · 2026</div>
              </div>
              <div className="sm:col-span-4 space-y-2">
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.detail}</p>
              </div>
              <div className="sm:col-span-1 flex justify-end">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
                  {item.status}
                </span>
              </div>
            </div>
            {idx < items.length - 1 && <div className="absolute left-5 top-full h-6 w-px bg-white/10" aria-hidden />}
          </div>
        ))}
      </div>
    </section>
  );
}
