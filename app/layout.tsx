import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inata Web3",
  description: "A modern Web3 landing built with Next.js, Tailwind, and ethers.js"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
