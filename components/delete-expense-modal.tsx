"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { useNotification } from "./ui/notification-provider";
import { Expense } from "./expense-list";
import idl from "../contracts/etracker.json";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://devnet.helius-rpc.com/?api-key=918a0709-2f7b-441d-a1ee-66f3eebe98f8';

interface DeleteExpenseModalProps {
  expense: Expense;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteExpenseModal = ({ expense, onClose, onSuccess }: DeleteExpenseModalProps) => {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleDelete = async () => {
    if (!publicKey) return;
    setLoading(true);

    try {
      const connection = new Connection(RPC_URL, 'confirmed');
      const provider = new AnchorProvider(
        connection,
        { publicKey, signTransaction, sendTransaction } as unknown as Wallet,
        { commitment: 'processed' }
      );
      
      const program = new Program(idl as any, provider);

      const [expenseAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("expense"),
          publicKey.toBuffer(),
          expense.id.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      // Simulate transaction
      try {
        const simulationResponse = await program.methods
          .deleteExpense(expense.id)
          .accounts({
            expenseAccount,
            authority: publicKey,
          })
          .transaction();
        
        simulationResponse.feePayer = publicKey;
        await connection.simulateTransaction(simulationResponse);
      } catch (simError: any) {
        throw new Error(`Transaction simulation failed: ${simError.message}`);
      }

      // Execute transaction
      const tx = await program.methods
        .deleteExpense(expense.id)
        .accounts({
          expenseAccount,
          authority: publicKey,
        })
        .rpc();

      await connection.confirmTransaction(tx, 'finalized');
      
      showNotification({
        title: "Success",
        description: "Expense deleted successfully!",
        variant: "success",
        duration: 5000
      });

      onSuccess();
    } catch (error: any) {
      console.error("Error deleting expense:", error);
      showNotification({
        title: "Error",
        description: `Failed to delete expense: ${error.message}`,
        variant: "error",
        duration: 8000
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 w-full max-w-md relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold mb-4">Delete Expense</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this expense from {expense.merchantName}?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}; 