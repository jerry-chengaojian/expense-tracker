# VoteSphere DApp

A full-stack decentralized voting application built with Next.js, TypeScript, and Ethereum smart contracts.

## Overview

VoteSphere is a blockchain-based voting platform that allows users to:
- Create polls with customizable start and end times
- Submit proposals/candidates to active polls
- Vote on proposals in active polls
- Track voting statistics and results in real-time

**Project Address**: [https://votesphere-zeta.vercel.app/](https://votesphere-zeta.vercel.app/)

## Technology Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **UI Components**: Shadcn UI
- **Web3 Integration**: RainbowKit 2, Wagmi 2, Viem 2
- **Smart Contract**: Solidity 0.8.22
- **File Storage**: IPFS via Pinata

## Features

### For Voters
- Browse all active, upcoming, and completed polls
- Filter polls by status (In Progress, Coming Soon, Completed)
- Vote on proposals in active polls
- View detailed voting statistics and results
- Track your voting history

### For Poll Creators
- Create new polls with custom details and timing
- Upload cover images for polls (stored on IPFS)
- Manage your created polls
- End polls early if needed

### For Proposal Submitters
- Submit proposals to upcoming polls
- Add proposal details and images
- Track votes on your proposals

## Smart Contract

The VoteSphere smart contract (`VoteSphere.sol`) provides the following functionality:
- Poll creation and management
- Candidate/proposal submission
- Secure voting mechanism
- Vote counting and statistics
- Poll status tracking

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MetaMask or any other Ethereum wallet

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/votesphere.git
   cd votesphere
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PINATA_API_KEY=your_pinata_api_key
   NEXT_PINATA_SECRET_API_KEY=your_pinata_secret_key
   ```

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Connect Wallet**: Use the "Connect Wallet" button to connect your Ethereum wallet
2. **Browse Votes**: Explore active, upcoming, and completed polls on the home page
3. **Create Vote**: Use the "Create Vote" page to set up a new poll
4. **Submit Proposal**: Submit proposals to upcoming polls
5. **Vote**: Cast your vote on active polls
6. **Track Results**: View real-time voting statistics and results

## Project Structure

- `/app`: Next.js application code
  - `/api`: API routes for IPFS uploads
  - `/components`: Reusable UI components
  - `/create`: Poll creation page
  - `/my-votes`: User's voting history
  - `/votes`: Poll details and voting interface
  - `/utils`: Web3 utility functions
- `/contracts`: Solidity smart contracts
- `/public`: Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.