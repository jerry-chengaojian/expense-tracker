"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import idl from "../contracts/etracker.json";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://devnet.helius-rpc.com/?api-key=918a0709-2f7b-441d-a1ee-66f3eebe98f8';

export const CreateExpenseForm = () => {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [merchantName, setMerchantName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !merchantName || !amount) return;

    setLoading(true);
    setError(null);
    
    try {
      // Set up connection and provider
      const connection = new Connection(RPC_URL, 'confirmed');
      const provider = new AnchorProvider(
        connection,
        { publicKey, signTransaction, sendTransaction } as unknown as Wallet,
        { commitment: 'processed' }
      );
      
      // Initialize program - fixed constructor
      const program = new Program(idl as any, provider);
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

      alert("Expense created successfully!");
      setMerchantName("");
      setAmount("");
    } catch (error: any) {
      console.error("Error creating expense:", error);
      setError(error.message || "Failed to create expense");
      alert(`Failed to create expense: ${error.message || "Unknown error"}`);
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
          {loading ? "Processing..." : "Create Expense"}
        </button>
      </form>
    </div>
  );
};
