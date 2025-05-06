"use client"

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WalletStatus } from "@/components/wallet-status";
import { ExpenseList } from "@/components/expense-list";

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
        <ExpenseList />
        <Footer />
      </div>
    </div>
  );
}
