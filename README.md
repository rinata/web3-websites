# Token Transfer dApp

Responsive ERC-20 transfer dApp built with Next.js (App Router), TypeScript, Tailwind CSS, and ethers.js v6. Connect MetaMask, load token metadata, validate inputs, and track transaction status end-to-end.

## Setup
1) Use Node.js 18+ (LTS recommended).
2) Install deps:
   ```bash
   npm install
   ```
3) Run dev server:
   ```bash
   npm run dev
   ```
   Then open http://localhost:3000.

## Features
- MetaMask connect/disconnect via ethers v6 BrowserProvider.
- Shows shortened address, network name, and ETH balance.
- ERC-20 transfer form:
  - Enter token address, recipient, amount.
  - Auto-load token name/symbol/decimals and user token balance.
  - Max button, inline validation, reset.
  - TX lifecycle: awaiting confirmation → pending (hash) → confirmed/failed, with explorer link.
- Error handling: missing MetaMask, rejected request, invalid addresses, insufficient token balance, insufficient gas, RPC/contract revert.
- Minimal, responsive UI using Tailwind cards.

## File Structure
- `app/page.tsx` – Main page layout (hero + cards).
- `components/WalletConnect.tsx` – Connect UI and wallet details.
- `components/TokenTransferForm.tsx` – ERC-20 transfer flow.
- `components/Web3Provider.tsx` – Context provider using `useWeb3`.
- `lib/web3.ts` – Wallet hook (connect, state, listeners, balance).
- `lib/erc20.ts` – Minimal ABI helpers for metadata, balance, transfer.
- `lib/explorers.ts` – Chain ID → explorer link helper.
- `types/` – Shared types.
- `tailwind.config.ts`, `postcss.config.js`, `app/globals.css` – Styling config.

## Testing on Sepolia
- Get test ETH: https://sepoliafaucet.com/ or https://faucet.quicknode.com/ethereum/sepolia
- Example placeholder token address: replace `0xYourSepoliaToken` with a known ERC-20 on Sepolia (e.g., a faucet-minted test token).
- Connect MetaMask to Sepolia, paste the token address, and try a small transfer to another Sepolia address you control.

## Deploy to Vercel
1) Push the repo to GitHub.
2) In Vercel, import the project and select **Next.js** preset.
3) Build command: `next build`, output: `.next`.
4) No env vars required for this starter. Deploy and go live.

## Customize
- Add more explorer mappings in `lib/explorers.ts`.
- Tighten validation or add allowance/approve flows in `lib/erc20.ts`.
- Style tweaks: adjust theme in `tailwind.config.ts` and `app/globals.css`.
