"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { getRegistryContract } from "../lib/contracts";

export default function BatchRegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const formData = new FormData(e.currentTarget);
      const batchId = formData.get("batchId") as string;
      const drugName = formData.get("drugName") as string;
      const batchNumber = formData.get("batchNumber") as string;
      const expiry = formData.get("expiryDate") as string;

      const expiryTimestamp = Math.floor(new Date(expiry).getTime() / 1000);

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = await getRegistryContract(signer);
      
      const tx = await contract.registerBatch(batchId, drugName, batchNumber, expiryTimestamp);
      
      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();
      
      setStatus("Batch registered successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message || 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-md w-full mx-auto shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">Register New Drug Batch</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Batch ID (bytes32)</label>
          <input required name="batchId" placeholder="0x..." className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Drug Name</label>
          <input required name="drugName" className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Batch Number</label>
          <input required name="batchNumber" className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Expiry Date</label>
          <input required type="date" name="expiryDate" className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
        </div>
      </div>

      <button
        disabled={loading}
        className="mt-6 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
      >
        {loading ? "Registering..." : "Register Batch"}
      </button>

      {status && <p className="mt-4 text-sm text-center text-slate-300">{status}</p>}
    </form>
  );
}
