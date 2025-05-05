import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from '@/components/ui/notification-provider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoteSphere - Decentralized Voting Platform",
  description: "A decentralized voting platform for creating and participating in transparent, secure blockchain-based polls",
  keywords: ["voting", "blockchain", "ethereum", "web3", "decentralized", "polls", "elections", "democracy"],
  authors: [{ name: "VoteSphere Team" }],
  openGraph: {
    title: "VoteSphere - Decentralized Voting Platform",
    description: "Create and participate in transparent blockchain-based polls",
    type: "website",
    siteName: "VoteSphere",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoteSphere - Decentralized Voting Platform",
    description: "Create and participate in transparent blockchain-based polls",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased container mx-auto`}
      >
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
