import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { BN, web3 } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { useNotification } from "@/components/ui/notification-provider";
import { Expense } from "@/lib/types";
import { 
  getProvider, 
  getProgram, 
  getExpensePDA, 
  solToLamports,
  lamportsToSol
} from "@/lib/solana-utils";

export const useExpense = (connection: Connection) => {
  const { publicKey, signTransaction, sendTransaction, connected } = useWallet();
  const { showNotification } = useNotification();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Reset error state
  const resetError = () => {
    setError('');
  };
  
  // Ensure wallet is connected
  const ensureWalletConnected = () => {
    if (!connected || !publicKey) {
      showNotification({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "error"
      });
      return false;
    }
    return true;
  };
  
  // Create a new expense
  const createExpense = async (expenseId: number, merchantName: string, amount: number) => {
    if (!ensureWalletConnected()) return;
    
    if (!expenseId || !merchantName || !amount) {
      showNotification({
        title: "Error",
        description: "Please fill in all fields",
        variant: "error"
      });
      return;
    }
    
    try {
      setLoading(true);
      resetError();
      
      const provider = getProvider(connection, publicKey, signTransaction, sendTransaction);
      const program = getProgram(provider);
      
      const bnId = new BN(expenseId);
      const bnAmount = new BN(solToLamports(amount));
      
      const expensePDA = getExpensePDA(publicKey, bnId);
      
      await program.methods
        .initializeExpense(
          bnId, 
          merchantName, 
          bnAmount
        )
        .accounts({
          authority: publicKey,
          expenseAccount: expensePDA,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      
      showNotification({
        title: "Success",
        description: "Expense created successfully!",
        variant: "success"
      });
      
      return true;
    } catch (err: any) {
      console.error("Error creating expense:", err);
      setError(err.message || "Failed to create expense");
      showNotification({
        title: "Transaction failed",
        description: err.message,
        variant: "error"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing expense
  const updateExpense = async (expenseId: number, merchantName: string, amount: number) => {
    if (!ensureWalletConnected()) return;
    
    if (!expenseId || !merchantName || !amount) {
      showNotification({
        title: "Error",
        description: "Please fill in all fields",
        variant: "error"
      });
      return;
    }
    
    try {
      setLoading(true);
      resetError();
      
      const provider = getProvider(connection, publicKey, signTransaction, sendTransaction);
      const program = getProgram(provider);
      
      const bnId = new BN(expenseId);
      const bnAmount = new BN(solToLamports(amount));
      
      const expensePDA = getExpensePDA(publicKey, bnId);
      
      await program.methods
        .modifyExpense(
          bnId, 
          merchantName, 
          bnAmount
        )
        .accounts({
          authority: publicKey,
          expenseAccount: expensePDA,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      
      showNotification({
        title: "Success",
        description: "Expense updated successfully!",
        variant: "success"
      });
      
      return true;
    } catch (err: any) {
      console.error("Error updating expense:", err);
      setError(err.message || "Failed to update expense");
      showNotification({
        title: "Transaction failed",
        description: err.message,
        variant: "error"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete an expense
  const deleteExpense = async (expenseId: number) => {
    if (!ensureWalletConnected()) return;
    
    if (!expenseId) {
      showNotification({
        title: "Error",
        description: "Please enter an expense ID",
        variant: "error"
      });
      return;
    }
    
    try {
      setLoading(true);
      resetError();
      
      const provider = getProvider(connection, publicKey, signTransaction, sendTransaction);
      const program = getProgram(provider);
      
      const expensePDA = getExpensePDA(publicKey, expenseId);
      
      await program.methods
        .deleteExpense(new BN(expenseId))
        .accounts({
          authority: publicKey,
          expenseAccount: expensePDA,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      
      showNotification({
        title: "Success",
        description: "Expense deleted successfully!",
        variant: "success"
      });
      
      return true;
    } catch (err: any) {
      console.error("Error deleting expense:", err);
      setError(err.message || "Failed to delete expense");
      showNotification({
        title: "Transaction failed",
        description: err.message,
        variant: "error"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Search for an expense by ID
  const searchExpense = async (searchId: number) => {
    if (!ensureWalletConnected()) return;
    
    if (!searchId) {
      await fetchExpenses();
      return;
    }
    
    try {
      setLoading(true);
      resetError();
      
      const provider = getProvider(connection, publicKey, signTransaction, sendTransaction);
      const program = getProgram(provider);
      
      const expensePDA = getExpensePDA(publicKey, searchId);
      
      try {
        const expenseAccount = await program.account.expenseAccount.fetch(expensePDA);
        
        if (expenseAccount) {
          const expense: Expense = {
            id: expenseAccount.id.toNumber(),
            merchant_name: expenseAccount.merchantName,
            amount: lamportsToSol(expenseAccount.amount.toNumber()),
            publicKey: expensePDA.toString()
          };
          
          setExpenses([expense]);
          showNotification({
            title: "Success",
            description: "Expense found!",
            variant: "success"
          });
        }
      } catch (err) {
        showNotification({
          title: "Notice",
          description: "No expense found",
          variant: "warning"
        });
        setExpenses([]);
      }
    } catch (err: any) {
      console.error("Error searching expense:", err);
      setError(err.message || "Failed to search expense");
      showNotification({
        title: "Search failed",
        description: err.message,
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch all expenses
  const fetchExpenses = async () => {
    if (!ensureWalletConnected()) return;
    
    try {
      setLoading(true);
      resetError();
      
      const provider = getProvider(connection, publicKey, signTransaction, sendTransaction);
      const program = getProgram(provider);
      
      try {
        const expenseAccounts = await program.account.expenseAccount.all([
          {
            memcmp: {
              offset: 8 + 8, // Skip discriminator and id
              bytes: publicKey.toBase58()
            }
          }
        ]);
        
        const fetchedExpenses: Expense[] = expenseAccounts.map(account => ({
          id: account.account.id.toNumber(),
          merchant_name: account.account.merchantName,
          amount: lamportsToSol(account.account.amount.toNumber()),
          publicKey: account.publicKey.toString()
        }));
        
        setExpenses(fetchedExpenses);
      } catch (e) {
        console.error("Error fetching accounts:", e);
        setExpenses([]);
        setError("Failed to fetch expenses. Please check your connection and try again.");
      }
    } catch (err: any) {
      console.error("Error in fetchExpenses:", err);
      setError(err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };
  
  return {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    searchExpense,
    fetchExpenses,
    setExpenses
  };
}; 