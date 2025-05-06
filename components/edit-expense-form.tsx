"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Expense } from "@/lib/types";

interface EditExpenseFormProps {
  onSubmit: (expenseId: number, merchantName: string, amount: number) => Promise<boolean | undefined>;
  loading: boolean;
  editingExpense?: Expense;
}

export const EditExpenseForm = ({ onSubmit, loading, editingExpense }: EditExpenseFormProps) => {
  const { connected } = useWallet();
  
  const [editId, setEditId] = useState<number | ''>('');
  const [editMerchant, setEditMerchant] = useState('');
  const [editAmount, setEditAmount] = useState<number | ''>('');
  
  // Update form when selected expense changes
  useEffect(() => {
    if (editingExpense) {
      setEditId(editingExpense.id);
      setEditMerchant(editingExpense.merchant_name);
      setEditAmount(editingExpense.amount);
      
      // Scroll to this component
      const element = document.getElementById('edit-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [editingExpense]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (typeof editId === 'number' && editMerchant && typeof editAmount === 'number') {
      const success = await onSubmit(editId, editMerchant, editAmount);
      
      if (success) {
        // Reset form
        setEditId('');
        setEditMerchant('');
        setEditAmount('');
      }
    }
  };
  
  return (
    <div id="edit-section" className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl mb-5 pb-2 border-b border-gray-200">Edit Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-600">Expense ID</label>
          <input 
            type="number" 
            placeholder="Enter expense ID to edit" 
            className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"
            value={editId}
            onChange={(e) => setEditId(e.target.value ? parseInt(e.target.value) : '')}
            disabled={loading}
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-600">Merchant Name</label>
          <input 
            type="text" 
            placeholder="Enter new merchant name" 
            className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"
            value={editMerchant}
            onChange={(e) => setEditMerchant(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-600">Amount (SOL)</label>
          <input 
            type="number" 
            step="0.000000001"
            placeholder="Enter new amount" 
            className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value ? parseFloat(e.target.value) : '')}
            disabled={loading}
          />
        </div>
        <div className="flex gap-3">
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
            disabled={loading || !connected}
          >
            {loading ? "Processing..." : "Update Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}; 