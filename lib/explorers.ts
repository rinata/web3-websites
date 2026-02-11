const explorers: Record<number, string> = {
  1: "https://etherscan.io/tx/",
  11155111: "https://sepolia.etherscan.io/tx/",
  5: "https://goerli.etherscan.io/tx/",
  137: "https://polygonscan.com/tx/",
  80001: "https://mumbai.polygonscan.com/tx/"
};

export function explorerLink(chainId: number | undefined, txHash: string): string {
  if (!chainId) return `https://etherscan.io/tx/${txHash}`;
  const base = explorers[chainId] || "https://etherscan.io/tx/";
  return `${base}${txHash}`;
}
