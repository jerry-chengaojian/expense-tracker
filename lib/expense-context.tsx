"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { web3 } from "@coral-xyz/anchor";
import { ClusterType, Expense } from "./types";
import { useExpense } from "@/hooks/use-expense";
import { getConnection } from "./solana-utils";

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  error: string;
  cluster: ClusterType;
  createExpense: (expenseId: number, merchantName: string, amount: number) => Promise<boolean | undefined>;
  updateExpense: (expenseId: number, merchantName: string, amount: number) => Promise<boolean | undefined>;
  deleteExpense: (expenseId: number) => Promise<boolean | undefined>;
  searchExpense: (searchId: number) => Promise<void>;
  fetchExpenses: () => Promise<void>;
  setCluster: (cluster: ClusterType) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [cluster, setCluster] = useState<ClusterType>('devnet');
  const connection = getConnection(cluster as web3.Cluster);
  
  const {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    searchExpense,
    fetchExpenses
  } = useExpense(connection);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        error,
        cluster,
        createExpense,
        updateExpense,
        deleteExpense,
        searchExpense,
        fetchExpenses,
        setCluster
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenseContext must be used within an ExpenseProvider");
  }
  return context;
}; 