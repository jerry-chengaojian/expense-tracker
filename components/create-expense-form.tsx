"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import idl from "../contracts/etracker.json";
import { useNotification } from "./ui/notification-provider";
import { Expense } from "./expense-list";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://devnet.helius-rpc.com/?api-key=918a0709-2f7b-441d-a1ee-66f3eebe98f8';

interface CreateExpenseFormProps {
  onSuccess?: () => void;
  expense?: Expense | null;
  isEditMode?: boolean;
}

export const CreateExpenseForm = ({ onSuccess, expense, isEditMode }: CreateExpenseFormProps) => {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [merchantName, setMerchantName] = useState(expense?.merchantName || "");
  const [amount, setAmount] = useState(expense?.amount.toString() || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !merchantName || !amount) return;

    setLoading(true);
    setError(null);
    
    try {
      const connection = new Connection(RPC_URL, 'confirmed');
      const provider = new AnchorProvider(
        connection,
        { publicKey, signTransaction, sendTransaction } as unknown as Wallet,
        { commitment: 'processed' }
      );
      
      const program = new Program(idl as any, provider);
      
      if (isEditMode && expense) {
        // Handle edit expense
        const [expenseAccount] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("expense"),
            publicKey.toBuffer(),
            expense.id.toArrayLike(Buffer, "le", 8),
          ],
          program.programId
        );

        // Simulate the modification transaction
        try {
          const simulationResponse = await program.methods
            .modifyExpense(expense.id, merchantName, new BN(parseInt(amount)))
            .accounts({
              expenseAccount,
              authority: publicKey,
            })
            .transaction();
          
          simulationResponse.feePayer = publicKey;
          await connection.simulateTransaction(simulationResponse);
        } catch (simError: any) {
          console.error("Transaction simulation failed:", simError);
          throw new Error(`Transaction simulation failed: ${simError.message}`);
        }

        // Execute the modification
        const tx = await program.methods
          .modifyExpense(expense.id, merchantName, new BN(parseInt(amount)))
          .accounts({
            expenseAccount,
            authority: publicKey,
          })
          .rpc();

        await connection.confirmTransaction(tx, 'finalized');
        
        showNotification({
          title: "Success",
          description: "Expense updated successfully!",
          variant: "success",
          duration: 5000
        });
      } else {
        // Existing create expense logic
        const id = new BN(Date.now());
        
        const [expenseAccount] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("expense"),
            publicKey.toBuffer(),
            id.toArrayLike(Buffer, "le", 8),
          ],
          program.programId
        );

        // Simulate the transaction first to check for potential errors
        try {
          const simulationResponse = await program.methods
            .initializeExpense(id, merchantName, new BN(parseInt(amount)))
            .accounts({
              expenseAccount,
              authority: publicKey,
              systemProgram: SystemProgram.programId,
            })
            .transaction();
          
          // 设置费用支付者
          simulationResponse.feePayer = publicKey;
          
          // Simulate transaction using the connection directly
          await connection.simulateTransaction(simulationResponse);
        } catch (simError: any) {
          console.error("Transaction simulation failed:", simError);
          throw new Error(`Transaction simulation failed: ${simError.message}`);
        }

        // Execute the transaction
        const tx = await program.methods
          .initializeExpense(id, merchantName, new BN(parseInt(amount)))
          .accounts({
            expenseAccount,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        
        // Confirm transaction
        await connection.confirmTransaction(tx, 'finalized');

        showNotification({
          title: "Success",
          description: "Expense created successfully!",
          variant: "success",
          duration: 5000
        });
      }
      
      setMerchantName("");
      setAmount("");
      onSuccess?.();
      
    } catch (error: any) {
      console.error("Error creating expense:", error);
      setError(error.message || "Failed to create expense");
      
      showNotification({
        title: "Error",
        description: `Failed to create expense: ${error.message || "Unknown error"}`,
        variant: "error",
        duration: 8000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Merchant Name</label>
          <input
            type="text"
            value={merchantName}
            onChange={(e) => setMerchantName(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
        >
          {loading ? "Processing..." : isEditMode ? "Update Expense" : "Create Expense"}
        </button>
      </form>
    </div>
  );
};
