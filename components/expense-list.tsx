"use client";

import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import { useNotification } from "./ui/notification-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import idl from "../contracts/etracker.json";
import { CreateExpenseForm } from "./create-expense-form";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://devnet.helius-rpc.com/?api-key=918a0709-2f7b-441d-a1ee-66f3eebe98f8';

interface Expense {
  id: BN;
  merchantName: string;
  amount: BN;
  authority: PublicKey;
  publicKey: string;
}

export const ExpenseList = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showNotification } = useNotification();
  const { publicKey } = useWallet();

  // 创建只读 Provider
  const getReadonlyProvider = () => {
    const connection = new Connection(RPC_URL, 'confirmed');
    const dummyWallet = {
      publicKey: PublicKey.default,
      signTransaction: async () => {
        throw new Error('Read-only provider cannot sign transactions.');
      },
      signAllTransactions: async () => {
        throw new Error('Read-only provider cannot sign transactions.');
      },
    };

    const provider = new AnchorProvider(connection, dummyWallet as unknown as Wallet, {
      commitment: 'processed',
    });

    return new Program(idl as any, provider);
  };

  // 获取所有支出记录
  const fetchAllExpenses = async () => {
    setLoading(true);
    try {
      const program = getReadonlyProvider();
      
      let allExpenses;
      if (publicKey) {
        // 如果钱包已连接，只获取该用户的支出
        allExpenses = await program.account.expenseAccount.all([
          {
            memcmp: {
              offset: 8, // 跳过discriminator
              bytes: publicKey.toBase58()
            }
          }
        ]);
      } else {
        // 如果钱包未连接，获取所有支出
        allExpenses = await program.account.expenseAccount.all();
      }

      const serializedExpenses = allExpenses.map(exp => ({
        ...exp.account,
        publicKey: exp.publicKey.toString(),
        id: exp.account.id,
        amount: exp.account.amount,
        authority: exp.account.owner,
        merchantName: exp.account.merchantName,
      }));

      setExpenses(serializedExpenses);
    } catch (error: any) {
      console.error("Error fetching expenses:", error);
      showNotification({
        title: "Error",
        description: `Failed to fetch expenses: ${error.message}`,
        variant: "error",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  // 当钱包连接状态改变时重新获取数据
  useEffect(() => {
    fetchAllExpenses();
  }, [publicKey]); // 添加 publicKey 作为依赖项

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">
          Expense Management
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Create Expense
          </button>
        </div>
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 w-full max-w-md relative shadow-xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold mb-4">Create New Expense</h3>
            <CreateExpenseForm />
          </div>
        </div>
      )}

      <div className="mt-6 rounded-lg border border-gray-200 overflow-hidden">
        {expenses.length > 0 ? (
          <div>
            <div className="bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 border-b border-gray-200 grid grid-cols-12">
              <div className="col-span-3">ID</div>
              <div className="col-span-5">Merchant</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            
            {expenses.map((expense) => (
              <div 
                key={expense.publicKey}
                className="grid grid-cols-12 items-center px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-all"
              >
                <div className="col-span-3 text-gray-600">
                  #{expense.id.toString()}
                </div>
                <div className="col-span-5 font-medium text-gray-800">
                  {expense.merchantName}
                </div>
                <div className="col-span-2 text-right font-medium text-red-600">
                  {expense.amount.toString()}
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <button 
                    className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-sm font-medium hover:bg-blue-200 transition-all disabled:opacity-50"
                    disabled
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-sm font-medium hover:bg-red-200 transition-all disabled:opacity-50"
                    disabled
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {loading ? "Loading expenses..." : "No expenses found"}
          </div>
        )}
      </div>
    </div>
  );
}; 