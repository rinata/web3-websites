const faqs = [
  {
    q: "Which networks are supported?",
    a: "Ethereum Mainnet and Sepolia are wired in. Extend SUPPORTED_NETWORKS in lib/web3.ts for more chains."
  },
  {
    q: "How are wallet states handled?",
    a: "The hook distinguishes missing MetaMask, wrong network, user rejection, RPC errors, and loading."
  },
  {
    q: "Can I swap ethers.js for wagmi?",
    a: "Yes. Replace the custom hook with wagmi connectors; the UI is already componentized."
  },
  {
    q: "How do I deploy?",
    a: "Push to GitHub, connect the repo in Vercel, set environment variables if any, and deploy the Next.js app."
  }
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-aqua">FAQ</p>
        <h2 className="text-3xl font-semibold text-white">Answers for quick setup</h2>
      </div>
      <div className="space-y-4">
        {faqs.map((item) => (
          <details key={item.q} className="group rounded-2xl border border-white/10 bg-white/5 p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-white">
              {item.q}
              <span className="text-aqua transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-gray-300">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
