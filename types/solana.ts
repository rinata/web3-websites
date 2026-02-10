export type SolanaStatus = "idle" | "connecting" | "connected" | "not-installed" | "rejected" | "error";

export interface SolanaState {
  address?: string;
  balance?: string;
  networkName?: string;
  status: SolanaStatus;
  error?: string;
}

export interface SolanaControls {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}
