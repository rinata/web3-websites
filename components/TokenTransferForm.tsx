"use client";

import { useEffect, useMemo, useState } from "react";
import { isAddress, parseUnits } from "ethers";
import { explorerLink } from "../lib/explorers";
import { getTokenBalance, getTokenMeta, isValidAmountInput, transferToken, type TokenMeta } from "../lib/erc20";
import { useWeb3Context } from "./Web3Provider";

type TxPhase = "idle" | "awaiting" | "pending" | "success" | "failed";

export function TokenTransferForm() {
  const { status, provider, address, chainId, networkName } = useWeb3Context();

  const [tokenAddress, setTokenAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const [tokenMeta, setTokenMeta] = useState<TokenMeta | null>(null);
  const [balanceFormatted, setBalanceFormatted] = useState<string>("");
  const [balanceRaw, setBalanceRaw] = useState<bigint>(0n);
  const [loadingToken, setLoadingToken] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [txPhase, setTxPhase] = useState<TxPhase>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const isConnected = status === "connected" && provider && address;

  useEffect(() => {
    // reset token info when address changes
    setTokenMeta(null);
    setBalanceFormatted("");
    setBalanceRaw(0n);
  }, [address]);

  useEffect(() => {
    const fetchTokenData = async () => {
      if (!provider || !address) return;
      if (!isAddress(tokenAddress)) return;
      setLoadingToken(true);
      setFormError(null);
      try {
        const meta = await getTokenMeta(provider, tokenAddress);
        setTokenMeta(meta);
        const { formatted, raw } = await getTokenBalance(provider, tokenAddress, address, meta.decimals);
        setBalanceFormatted(formatted);
        setBalanceRaw(raw);
      } catch (err) {
        setTokenMeta(null);
        setBalanceFormatted("");
        setBalanceRaw(0n);
        setFormError((err as Error).message);
      } finally {
        setLoadingToken(false);
      }
    };
    fetchTokenData();
  }, [address, provider, tokenAddress]);

  const explorerHref = useMemo(() => (txHash ? explorerLink(chainId, txHash) : null), [chainId, txHash]);

  const handleMax = () => {
    if (!balanceFormatted) return;
    setAmount(balanceFormatted);
  };

  const resetForm = () => {
    setTokenAddress("");
    setRecipient("");
    setAmount("");
    setTokenMeta(null);
    setBalanceFormatted("");
    setBalanceRaw(0n);
    setFormError(null);
    setTxPhase("idle");
    setTxHash(null);
    setTxError(null);
  };

  const validate = () => {
    if (!isConnected) return "Connect your wallet first.";
    if (!provider) return "MetaMask is not detected.";
    if (!isAddress(tokenAddress)) return "Enter a valid token contract address.";
    if (!isAddress(recipient)) return "Enter a valid recipient address.";
    if (!tokenMeta) return "Token metadata not loaded yet.";
    if (!isValidAmountInput(amount)) return "Enter a valid amount greater than zero.";

    const amountWei = parseUnits(amount, tokenMeta.decimals);
    if (amountWei <= 0) return "Amount must be greater than zero.";
    if (amountWei > balanceRaw) return "Insufficient token balance.";
    return null;
  };

  const handleTransfer = async () => {
    setFormError(null);
    setTxError(null);
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    if (!provider || !tokenMeta) return;

    try {
      setTxPhase("awaiting");
      const { hash } = await transferToken(provider, tokenAddress, recipient, amount, tokenMeta.decimals);
      setTxHash(hash);
      setTxPhase("pending");

      const receipt = await provider.waitForTransaction(hash);
      if (receipt?.status === 1) {
        setTxPhase("success");
        // refresh balance
        const { formatted, raw } = await getTokenBalance(provider, tokenAddress, address!, tokenMeta.decimals);
        setBalanceFormatted(formatted);
        setBalanceRaw(raw);
      } else {
        setTxPhase("failed");
        setTxError("Transaction failed or was reverted.");
      }
    } catch (error) {
      const message = normalizeTxError(error);
      setTxError(message);
      setTxPhase("failed");
    }
  };

  const actionDisabled = !isConnected || txPhase === "awaiting" || txPhase === "pending";

  return (
    <section className="glass rounded-2xl border border-white/10 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300">ERC-20</p>
          <h3 className="text-xl font-semibold text-white">Token Transfer</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
          {networkName || "Network"}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <Field
          label="Token contract address"
          value={tokenAddress}
          onChange={setTokenAddress}
          placeholder="0x..."
          disabled={txPhase === "awaiting" || txPhase === "pending"}
          hint={tokenMeta ? `${tokenMeta.name} (${tokenMeta.symbol}) • decimals ${tokenMeta.decimals}` : undefined}
          loading={loadingToken}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Recipient address"
            value={recipient}
            onChange={setRecipient}
            placeholder="0x recipient"
            disabled={txPhase === "awaiting" || txPhase === "pending"}
          />
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Amount</label>
              {balanceFormatted && (
                <button
                  type="button"
                  onClick={handleMax}
                  className="text-xs text-aqua underline underline-offset-4"
                  disabled={txPhase === "awaiting" || txPhase === "pending"}
                >
                  Max ({balanceFormatted} {tokenMeta?.symbol ?? ""})
                </button>
              )}
            </div>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1.25"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-aqua/60"
              disabled={txPhase === "awaiting" || txPhase === "pending"}
              inputMode="decimal"
            />
          </div>
        </div>

        {formError && <Banner tone="error" message={formError} />}
        {txError && txPhase === "failed" && <Banner tone="error" message={txError} />}
        {txPhase === "success" && <Banner tone="success" message="Transfer confirmed." />}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleTransfer}
            disabled={actionDisabled}
            className="rounded-full bg-gradient-to-r from-electric to-aqua px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
          >
            {txPhase === "awaiting" ? "Awaiting confirmation…" : txPhase === "pending" ? "Pending…" : "Send"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30"
            disabled={txPhase === "awaiting" || txPhase === "pending"}
          >
            Reset
          </button>
        </div>

        <TxStatus phase={txPhase} txHash={txHash} explorerHref={explorerHref} />
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  hint,
  loading
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  loading?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-gray-300">
        <span>{label}</span>
        {loading && <span className="text-xs text-gray-400">Loading…</span>}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-aqua/60"
        disabled={disabled}
        spellCheck={false}
      />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function TxStatus({ phase, txHash, explorerHref }: { phase: TxPhase; txHash: string | null; explorerHref: string | null }) {
  const label = (() => {
    switch (phase) {
      case "awaiting":
        return "Awaiting wallet confirmation…";
      case "pending":
        return "Transaction pending…";
      case "success":
        return "Confirmed";
      case "failed":
        return "Failed";
      default:
        return "Idle";
    }
  })();

  if (phase === "idle") return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200">
      <div className="flex items-center justify-between">
        <span>Status</span>
        <span className="font-medium text-white">{label}</span>
      </div>
      {txHash && (
        <p className="mt-2 break-all text-xs text-aqua">
          Tx:{" "}
          {explorerHref ? (
            <a href={explorerHref} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              {txHash}
            </a>
          ) : (
            txHash
          )}
        </p>
      )}
    </div>
  );
}

function Banner({ tone, message }: { tone: "error" | "success"; message: string }) {
  const styles =
    tone === "error"
      ? "border-red-500/40 bg-red-500/10 text-red-100"
      : "border-emerald-400/40 bg-emerald-500/10 text-emerald-100";
  return (
    <div className={`rounded-xl border px-3 py-2 text-sm ${styles}`}>
      {message}
    </div>
  );
}

function normalizeTxError(error: unknown): string {
  const message = (error as Error)?.message || "Transaction failed.";
  if (message.includes("user rejected")) return "User rejected the request.";
  if (message.includes("insufficient funds")) return "Insufficient ETH to cover gas.";
  if (message.includes("insufficient allowance")) return "Insufficient allowance.";
  if (message.includes("execution reverted")) return "Contract call reverted.";
  return message;
}
