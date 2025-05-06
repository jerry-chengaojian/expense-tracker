"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface CreateExpenseFormProps {
  onSubmit: (expenseId: number, merchantName: string, amount: number) => Promise<boolean | undefined>;
  loading: boolean;
}

export const CreateExpenseForm = ({ onSubmit, loading }: CreateExpenseFormProps) => {
  const { connected } = useWallet();
  
  const [expenseId, setExpenseId] = useState<number | ''>('');
  const [merchantName, setMerchantName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (typeof expenseId === 'number' && merchantName && typeof amount === 'number') {
      const success = await onSubmit(expenseId, merchantName, amount);
      
      if (success) {
        // Reset form
        setExpenseId('');
        setMerchantName('');
        setAmount('');
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl mb-5 pb-2 border-b border-gray-200">Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-600">Expense ID</label>
          <input 
            type="number" 
            placeholder="Enter expense ID" 
            className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"
            value={expenseId}
            onChange={(e) => setExpenseId(e.target.value ? parseInt(e.target.value) : '')}
            disabled={loading}
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-600">Merchant Name</label>
          <input 
            type="text" 
            placeholder="Enter merchant name" 
            className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"
            value={merchantName}
            onChange={(e) => setMerchantName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-600">Amount (SOL)</label>
          <input 
            type="number" 
            step="0.000000001"
            placeholder="Enter amount" 
            className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : '')}
            disabled={loading}
          />
        </div>
        <div className="flex gap-3">
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
            disabled={loading || !connected}
          >
            {loading ? "Processing..." : "Create Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}; 