# Inata Web3 Starter

Responsive Web3 landing page built with Next.js (App Router), TypeScript, Tailwind CSS, ethers.js v6, and Solana Phantom support. Includes MetaMask and Phantom connect/disconnect, network guards, and live balance display.

## Quickstart

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Features
- App Router, TypeScript, Tailwind design system.
- MetaMask connect/disconnect with BrowserProvider (ethers v6) and Phantom connect for Solana.
- Handles missing wallet, wrong network (Mainnet/Sepolia), rejection, and RPC errors; similar states for Solana.
- Shows address (shortened), network name, and ETH/SOL balances with refresh.
- Sections: Hero, Features, Roadmap, Team, FAQ, Footer.

## Project Structure
- `app/` – App Router pages (`page.tsx`, `layout.tsx`, global styles).
- `components/` – UI sections and wallet panel.
- `lib/web3.ts` – Web3 hook (connect, state, listeners).
- `types/` – Shared types.
- `tailwind.config.ts`, `postcss.config.js` – Styling config.

## Deploy to Vercel
1) Push the repo to GitHub.
2) In Vercel, import the project and select the repo.
3) Framework preset: **Next.js**. Build command: `next build`. Output: `.next`.
4) Add env vars if you introduce any (none required for this starter).
5) Deploy—Vercel handles HTTPS and edge CDN automatically.

## Notes
- EVM networks: Ethereum Mainnet and Sepolia (edit `SUPPORTED_NETWORKS` in `lib/web3.ts` to add more).
- Solana: connects to Devnet by default (see `lib/solana.ts` to change cluster).
- Wallets: MetaMask for EVM, Phantom for Solana; swap or extend connectors as needed.
