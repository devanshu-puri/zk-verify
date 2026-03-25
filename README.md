# ZKDrugChain

A decentralized, cryptographic medicine authenticity system using Zero-Knowledge proofs.

## Overview
This platform allows actors in the pharmaceutical supply chain to verify drug authenticity at every custody handoff using Noir ZK proofs, validated by zkVerify, and permanently recorded on Horizen EON.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Setup Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your deployer key.
3. **Compile ZK Circuits**
   Navigate to `circuits/custody_proof` and run `nargo compile`.
4. **Deploy Contracts**
   Run `npx hardhat run scripts/deploy.ts --network horizenEON`. This populates `lib/constants.ts` with the deployed address.
5. **Run Frontend**
   Run `npm run dev`.
