"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const WalletStatus = () => {
  const { publicKey, connected } = useWallet();
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex justify-between items-center">
      <div>
        <p>Wallet Status: <span>{connected ? "Connected" : "Not Connected"}</span></p>
        <p className="text-gray-600 text-sm break-all">
          Wallet Address: {publicKey ? publicKey.toString() : "Please connect wallet"}
        </p>
      </div>
      <WalletMultiButton
        style={{ backgroundColor: '#F97316', color: 'white' }}
      />
    </div>
  );
}; 