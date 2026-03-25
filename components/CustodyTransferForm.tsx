"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { getRegistryContract } from "../lib/contracts";
import { generateCustodyProof } from "../lib/proofGenerator";
import { submitCustodyProof } from "../lib/zkverify";

export default function CustodyTransferForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [zkResult, setZkResult] = useState<{ leafDigest: string; aggregationId: number} | null>(null);
  
  const [formData, setFormData] = useState({
    batchId: "",
    toEntityHash: "",
    chainStep: 1,
    batchData: ["1", "2", "3", "4", "5", "6", "7", "8"],
    entitySecret: "0x123",
    prevCustodianSecret: "0x456"
  });

  const handleGenerateAndSubmitProof = async () => {
    try {
      setLoading(true);
      setStatus("Generating Noir ZK Proof...");
      
      const handoffTimestamp = Math.floor(Date.now() / 1000).toString();
      
      const inputs = {
        batch_id: formData.batchId,
        entity_id_hash: formData.entitySecret,
        prev_entity_id_hash: formData.prevCustodianSecret,
        handoff_timestamp: handoffTimestamp,
        batch_commitment: "0x789",
        chain_step: formData.chainStep.toString(),
        is_valid_chain: "1",
        entity_secret: formData.entitySecret,
        batch_data: formData.batchData,
        prev_custodian_secret: formData.prevCustodianSecret
      };

      const { proof, publicInputs, vk } = await generateCustodyProof(inputs);
      
      setStatus("Submitting Proof to zkVerify Mainnet...");
      const result = await submitCustodyProof(proof, publicInputs, vk);
      
      setZkResult(result);
      setStep(2);
      setStatus("zkVerify Attestation Successful!");
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordOnChain = async () => {
    try {
      setLoading(true);
      setStatus("Submitting to Horizen EON...");
      
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = await getRegistryContract(signer);

      const tx = await contract.recordCustodyTransfer(
        formData.batchId,
        formData.toEntityHash,
        zkResult?.leafDigest,
        "0x0000000000000000000000000000000000000000000000000000000000000789", // Mock batchCommitment bytes32
        formData.chainStep,
        zkResult?.aggregationId,
        [], // Empty merkle path for mock/demo
        []  // Empty leaf side mapping
      );

      setStatus("Waiting for confirmation...");
      await tx.wait();
      
      setStatus("Success! Custody handoff recorded securely.");
      setStep(3);
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-lg w-full mx-auto shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">Custody Transfer</h2>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Batch ID</label>
            <input value={formData.batchId} onChange={e => setFormData({...formData, batchId: e.target.value})} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">To Entity Hash</label>
            <input value={formData.toEntityHash} onChange={e => setFormData({...formData, toEntityHash: e.target.value})} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Chain Step (1=Distributor, 2=Wholesaler, 3=Pharmacy)</label>
            <input type="number" min="1" max="3" value={formData.chainStep} onChange={e => setFormData({...formData, chainStep: Number(e.target.value)})} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
          </div>
          
          <button onClick={handleGenerateAndSubmitProof} disabled={loading} className="mt-6 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg">
            {loading ? "Processing..." : "Generate ZK Proof & Verify"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-900/30 border border-emerald-500/50 rounded-lg">
            <h3 className="text-emerald-400 font-medium mb-2">ZK Attestation Secured</h3>
            <p className="text-xs text-slate-400 break-all">Leaf Digest: {zkResult?.leafDigest}</p>
            <p className="text-xs text-slate-400">Aggregation ID: {zkResult?.aggregationId}</p>
          </div>
          
          <button onClick={handleRecordOnChain} disabled={loading} className="mt-4 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-lg">
            {loading ? "Confirming on Horizen EON..." : "Record on Horizen EON"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Transfer Complete</h3>
          <p className="text-slate-400">The custody record is now cryptographically secured on Horizen EON.</p>
        </div>
      )}

      {status && <p className="mt-4 text-sm text-center text-slate-300">{status}</p>}
    </div>
  );
}
