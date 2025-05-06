"use client";

import { ReactNode } from "react";
import AppWalletProvider from "@/components/AppWalletProvider";
import { ExpenseProvider } from "@/lib/expense-context";
import { NotificationProvider } from "@/components/ui/notification-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NotificationProvider>
      <AppWalletProvider>
        <ExpenseProvider>
          {children}
        </ExpenseProvider>
      </AppWalletProvider>
    </NotificationProvider>
  );
} 