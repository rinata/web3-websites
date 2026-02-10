export type Web3Status =
  | "idle"
  | "connecting"
  | "connected"
  | "not-installed"
  | "wrong-network"
  | "rejected"
  | "error";

export interface Web3State {
  address?: string;
  chainId?: number;
  networkName?: string;
  balance?: string;
  status: Web3Status;
  error?: string;
}

export interface Web3Controls {
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}
