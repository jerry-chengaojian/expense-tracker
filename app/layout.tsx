import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider";
import { NotificationProvider } from "@/components/ui/notification-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense Tracker | Solana",
  description: "Track your expenses on the Solana blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <NotificationProvider>
          <AppWalletProvider>
            {children}
          </AppWalletProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
