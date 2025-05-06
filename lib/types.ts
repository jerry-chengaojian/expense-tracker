// Expense interface
export interface Expense {
  id: number;
  merchant_name: string;
  amount: number;
  publicKey: string;
}

// Program account types
export interface ExpenseAccount {
  id: {
    toNumber: () => number;
  };
  merchantName: string;
  amount: {
    toNumber: () => number;
  };
  authority: any;
}

export interface ExpenseAccountWithPubkey {
  publicKey: {
    toString: () => string;
  };
  account: ExpenseAccount;
}

// Cluster type
export type ClusterType = 'devnet' | 'testnet' | 'mainnet-beta' | 'localnet'; 