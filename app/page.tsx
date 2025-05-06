"use client"

import { useState, useEffect } from "react";
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="px-4 sm:px-8 py-8">
      <div className="container mx-auto">
        <Header />
        
        <WalletStatus />
                
        <CreateExpenseForm 
        />
        
        {/* <ExpenseList 
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
        /> */}
        
        <Footer />
      </div>
    </div>
  );
}
