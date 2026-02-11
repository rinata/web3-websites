import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Token Transfer dApp",
  description: "Send ERC-20 tokens via MetaMask using Next.js, Tailwind, and ethers v6."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
