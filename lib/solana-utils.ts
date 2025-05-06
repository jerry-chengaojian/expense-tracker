import { Connection, PublicKey, clusterApiUrl, web3 } from "@solana/web3.js";
import { AnchorProvider, BN, Program, Wallet, Idl } from "@coral-xyz/anchor";
import idl from '../contracts/etracker.json';

// Program ID from IDL
export const programId = new PublicKey(idl.address);

// Get connection based on cluster
export const getConnection = (cluster: web3.Cluster = 'devnet') => {
  return new Connection(
    clusterApiUrl(cluster), 
    'confirmed'
  );
};

// Get provider for Anchor interactions
export const getProvider = (
  connection: Connection, 
  publicKey: PublicKey, 
  signTransaction: any, 
  sendTransaction: any
) => {
  if (!publicKey || !signTransaction || !sendTransaction) {
    throw new Error("Wallet not connected");
  }

  // Create wallet object
  const wallet = {
    publicKey,
    signTransaction,
    signAllTransactions: signTransaction,
    sendTransaction
  } as unknown as Wallet;

  return new AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed', preflightCommitment: 'confirmed' }
  );
};

// Get program instance
export const getProgram = (provider: AnchorProvider) => {
  // Validate IDL structure
  if (!idl || !idl.accounts || !Array.isArray(idl.accounts)) {
    throw new Error("Invalid IDL format: missing or invalid accounts");
  }
  
  try {
    return new Program(idl as any, programId, provider);
  } catch (error) {
    console.error("Program initialization error:", error);
    throw new Error("Unable to initialize Solana program: " + (error as Error).message);
  }
};

// Get expense PDA
export const getExpensePDA = (publicKey: PublicKey, expenseId: number | BN) => {
  const id = expenseId instanceof BN ? expenseId : new BN(expenseId);
  
  const [expensePDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("expense"), 
      publicKey.toBuffer(), 
      id.toArrayLike(Buffer, 'le', 8)
    ],
    programId
  );
  
  return expensePDA;
};

// Convert lamports to SOL
export const lamportsToSol = (lamports: number) => {
  return lamports / web3.LAMPORTS_PER_SOL;
};

// Convert SOL to lamports
export const solToLamports = (sol: number) => {
  return Math.round(sol * web3.LAMPORTS_PER_SOL);
}; 