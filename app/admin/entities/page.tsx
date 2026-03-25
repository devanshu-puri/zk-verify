"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { getRegistryContract } from "../../../lib/contracts";

export default function AdminEntitiesPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const wallet = (formData.get("wallet") as string).trim();
      const type = Number(formData.get("type"));

      if (!ethers.isAddress(wallet)) {
        throw new Error("Invalid Ethereum wallet address format.");
      }

      // Hash wallet with a salt using ethers to generate entityIdHash
      const entityIdHash = ethers.keccak256(ethers.toUtf8Bytes(wallet + "ZKDrugChain"));

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = await getRegistryContract(signer);
      
      const tx = await contract.registerEntity(entityIdHash, name, type, wallet);
      
      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();
      
      setStatus("Entity registered successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 flex justify-center">
      <form onSubmit={handleRegister} className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6">Admin: Register Entity</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Entity Name</label>
            <input required name="name" className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Ethereum Wallet Address</label>
            <input required name="wallet" placeholder="0x..." className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Role Type</label>
            <select name="type" className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white">
              <option value="0">Manufacturer (0)</option>
              <option value="1">Distributor (1)</option>
              <option value="2">Wholesaler (2)</option>
              <option value="3">Pharmacy (3)</option>
            </select>
          </div>
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? "Registering..." : "Register Entity"}
        </button>

        {status && <p className="mt-4 text-sm text-center text-slate-300">{status}</p>}
      </form>
    </div>
  );
}
