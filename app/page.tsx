"use client"

import { useState, useEffect } from "react";
import { useExpenseContext } from "@/lib/expense-context";
import { useInitExpenses } from "@/hooks/use-init-expenses";
import { Expense } from "@/lib/types";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WalletStatus } from "@/components/wallet-status";
import { ErrorDisplay } from "@/components/error-display";
import { CreateExpenseForm } from "@/components/create-expense-form";
import { ExpenseList } from "@/components/expense-list";
import { EditExpenseForm } from "@/components/edit-expense-form";
import { DeleteExpenseForm } from "@/components/delete-expense-form";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [deleteId, setDeleteId] = useState<number | undefined>();
  
  const {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    searchExpense,
    fetchExpenses
  } = useExpenseContext();
  
  // Initialize expenses when wallet connects
  useInitExpenses();
  
  // Handle client-side mounting for wallet adapter
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Handle edit button click
  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
  };
  
  // Handle delete button click
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="px-4 sm:px-8 py-8">
      <div className="container">
        <Header />
        
        <WalletStatus />
        
        <ErrorDisplay error={error} />
        
        <CreateExpenseForm 
          onSubmit={createExpense}
          loading={loading}
        />
        
        <ExpenseList 
          expenses={expenses}
          loading={loading}
          onSearch={searchExpense}
          onRefresh={fetchExpenses}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
        
        <EditExpenseForm 
          onSubmit={updateExpense}
          loading={loading}
          editingExpense={editingExpense}
        />
        
        <DeleteExpenseForm 
          onSubmit={deleteExpense}
          loading={loading}
          deleteId={deleteId}
        />
        
        <Footer />
      </div>
    </div>
  );
}
