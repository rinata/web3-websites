import { BrowserProvider, Contract, formatUnits, isAddress, parseUnits } from "ethers";

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

export interface TokenMeta {
  name: string;
  symbol: string;
  decimals: number;
}

export async function getTokenMeta(provider: BrowserProvider, tokenAddress: string): Promise<TokenMeta> {
  if (!isAddress(tokenAddress)) throw new Error("Invalid token address");
  const contract = new Contract(tokenAddress, ERC20_ABI, provider);
  const [name, symbol, decimals] = await Promise.all([contract.name(), contract.symbol(), contract.decimals()]);
  return { name, symbol, decimals: Number(decimals) };
}

export async function getTokenBalance(
  provider: BrowserProvider,
  tokenAddress: string,
  owner: string,
  decimals: number
): Promise<{ formatted: string; raw: bigint }> {
  const contract = new Contract(tokenAddress, ERC20_ABI, provider);
  const balance: bigint = await contract.balanceOf(owner);
  return { formatted: formatUnits(balance, decimals), raw: balance };
}

export async function transferToken(
  provider: BrowserProvider,
  tokenAddress: string,
  to: string,
  amountHuman: string,
  decimals: number
): Promise<{ hash: string }> {
  if (!isAddress(tokenAddress)) throw new Error("Invalid token address");
  if (!isAddress(to)) throw new Error("Invalid recipient address");
  const contract = new Contract(tokenAddress, ERC20_ABI, await provider.getSigner());
  const amount = parseUnits(amountHuman, decimals);
  const tx = await contract.transfer(to, amount);
  return { hash: tx.hash };
}

export function isValidAmountInput(value: string): boolean {
  // Disallow empty, zero, negative, or scientific notation
  if (!value || value.trim() === "") return false;
  if (/[eE]/.test(value)) return false;
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return false;
  // Accept up to 30 decimal places to be safe
  return /^\d+(\.\d{1,30})?$/.test(value);
}
