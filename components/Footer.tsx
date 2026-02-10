export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-gray-200">
          <span className="h-2 w-2 rounded-full bg-aqua" />
          Inata Web3 Starter
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#roadmap" className="hover:text-white">Roadmap</a>
          <a href="#team" className="hover:text-white">Team</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </div>
        <span className="text-gray-500">Built with Next.js, Tailwind, ethers v6.</span>
      </div>
    </footer>
  );
}
