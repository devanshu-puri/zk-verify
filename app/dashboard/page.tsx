"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { getRegistryContract } from "../../lib/contracts";

export default function Dashboard() {
  const [account, setAccount] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const checkRole = async () => {
      try {
        if (!(window as any).ethereum) {
          if (mounted) setLoading(false);
          return;
        }
        
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length === 0) {
          if (mounted) setLoading(false);
          return;
        }
        
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        if (mounted) setAccount(address);

        const contract = await getRegistryContract(signer);
        const entityIdHash = await contract.walletToEntity(address);
        
        if (entityIdHash && entityIdHash !== ethers.ZeroHash) {
          const entity = await contract.entities(entityIdHash);
          if (mounted) setEntityType(Number(entity.entityType));
        } else {
          if (mounted) setEntityType(-1); // Unregistered
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    checkRole();
    (window as any).ethereum?.on('accountsChanged', checkRole);
    return () => {
      mounted = false;
      (window as any).ethereum?.removeListener('accountsChanged', checkRole);
    };
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-400">Loading your profile...</div>;
  
  if (!account) return (
    <div className="p-12 text-center max-w-md mx-auto mt-12 bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-2">Connect Wallet</h2>
      <p className="text-slate-400 mb-6">Please connect your MetaMask wallet to Horizen EON to access the dashboard.</p>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Supply Chain Dashboard</h1>

      {entityType === -1 && (
        <div className="p-6 bg-red-900/20 border border-red-500/50 rounded-xl mb-8">
          <h3 className="text-red-400 font-bold mb-2">Unregistered Address</h3>
          <p className="text-sm text-red-300">Your wallet {account} is not mapped to any registered Entity. Please contact the platform admin to be registered.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entityType === 0 && (
          <Link href="/manufacturer/register-batch" className="block p-6 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors group shadow-lg drop-shadow-sm">
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 mb-2 transition-colors">Register New Batch →</h3>
            <p className="text-sm text-slate-400">As a manufacturer, securely log new pharmaceutical batches to the distributed ledger.</p>
          </Link>
        )}

        {(entityType === 0 || entityType === 1 || entityType === 2) && (
          <Link href="/custody/transfer" className="block p-6 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors group shadow-lg drop-shadow-sm">
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 mb-2 transition-colors">Transfer Custody →</h3>
            <p className="text-sm text-slate-400">Submit a Noir Zero-Knowledge proof and transfer drug batch custody to the next party.</p>
          </Link>
        )}

        <Link href="/admin/entities" className="block p-6 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors group shadow-lg drop-shadow-sm">
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 mb-2 transition-colors">Admin Panel →</h3>
          <p className="text-sm text-slate-400">Owner-only area to register new entities (Distributors, Pharmacies, etc.) to the network.</p>
        </Link>
      </div>
    </div>
  );
}
