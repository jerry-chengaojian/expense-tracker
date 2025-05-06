"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Expense } from "@/lib/types";

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  onSearch: (searchId: number) => Promise<void>;
  onRefresh: () => Promise<void>;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

export const ExpenseList = ({ 
  expenses, 
  loading, 
  onSearch, 
  onRefresh, 
  onEdit, 
  onDelete 
}: ExpenseListProps) => {
  const { connected } = useWallet();
  const [searchId, setSearchId] = useState<number | ''>('');
  
  const handleSearch = async () => {
    if (typeof searchId === 'number') {
      await onSearch(searchId);
    } else {
      await onRefresh();
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl mb-5 pb-2 border-b border-gray-200">Expense Management</h2>
      <div className="mb-5">
        <label className="block mb-2 font-bold text-gray-600">Search Expense ID</label>
        <input 
          type="number" 
          placeholder="Enter expense ID to search" 
          className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value ? parseInt(e.target.value) : '')}
          disabled={loading}
        />
      </div>
      <div className="flex gap-3 mb-5">
        <button 
          type="button" 
          className="bg-blue-500 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
          onClick={handleSearch}
          disabled={loading || !connected}
        >
          {loading ? "Searching..." : "Search"}
        </button>
        <button 
          type="button" 
          className="bg-gray-500 text-white px-6 py-3 rounded font-bold hover:bg-gray-700 transition-all disabled:opacity-50"
          onClick={onRefresh}
          disabled={loading || !connected}
        >
          Refresh All
        </button>
      </div>
      
      <div className="mt-5">
        {loading ? (
          <div className="text-center p-4">Loading expenses...</div>
        ) : expenses.length > 0 ? (
          expenses.map((expense) => (
            <div key={expense.id} className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-all">
              <div className="flex-1">
                <div className="font-bold text-lg">{expense.merchant_name}</div>
                <div>ID: {expense.id}</div>
              </div>
              <div className="text-red-500 text-xl font-bold">{expense.amount} SOL</div>
              <div className="flex gap-2">
                <button 
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold"
                  onClick={() => onEdit(expense)}
                >
                  Edit
                </button>
                <button 
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold"
                  onClick={() => onDelete(expense.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-gray-500">No expenses found</div>
        )}
      </div>
    </div>
  );
}; 