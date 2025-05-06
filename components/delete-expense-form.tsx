"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface DeleteExpenseFormProps {
  onSubmit: (expenseId: number) => Promise<boolean | undefined>;
  loading: boolean;
  deleteId?: number;
}

export const DeleteExpenseForm = ({ onSubmit, loading, deleteId: initialDeleteId }: DeleteExpenseFormProps) => {
  const { connected } = useWallet();
  
  const [deleteId, setDeleteId] = useState<number | ''>('');
  
  // Update form when selected expense changes
  useEffect(() => {
    if (initialDeleteId) {
      setDeleteId(initialDeleteId);
      
      // Scroll to this component
      const element = document.getElementById('delete-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialDeleteId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (typeof deleteId === 'number') {
      const success = await onSubmit(deleteId);
      
      if (success) {
        // Reset form
        setDeleteId('');
      }
    }
  };
  
  return (
    <div id="delete-section" className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl mb-5 pb-2 border-b border-gray-200">Delete Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-600">Expense ID</label>
          <input 
            type="number" 
            placeholder="Enter expense ID to delete" 
            className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value ? parseInt(e.target.value) : '')}
            disabled={loading}
          />
        </div>
        <div className="flex gap-3">
          <button 
            type="submit" 
            className="bg-red-500 text-white px-6 py-3 rounded font-bold hover:bg-red-700 transition-all disabled:opacity-50"
            disabled={loading || !connected}
          >
            {loading ? "Processing..." : "Delete Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}; 