import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useExpenseContext } from "@/lib/expense-context";

export const useInitExpenses = () => {
  const { connected, publicKey } = useWallet();
  const { fetchExpenses } = useExpenseContext();
  
  useEffect(() => {
    if (connected && publicKey) {
      fetchExpenses();
    }
  }, [connected, publicKey, fetchExpenses]);
}; 