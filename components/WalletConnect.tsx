"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { HORIZEN_EON_CHAIN_ID, HORIZEN_EON_RPC } from "../lib/constants";

export default function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const network = await provider.getNetwork();

      if (Number(network.chainId) !== HORIZEN_EON_CHAIN_ID) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.toBeHex(HORIZEN_EON_CHAIN_ID) }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await (window as any).ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: ethers.toBeHex(HORIZEN_EON_CHAIN_ID),
                  chainName: "Ethereum Sepolia",
                  rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
                  nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          }
        }
      }

      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());
      
      // Listen to account changes
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center">
      {account ? (
        <div className="px-4 py-2 bg-emerald-900 text-emerald-100 rounded-md text-sm font-medium border border-emerald-700">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
