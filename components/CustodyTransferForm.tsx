"use client";

import { useState, useMemo } from "react";
import { ethers } from "ethers";
import { getRegistryContract } from "../lib/contracts";
import { generateCustodyProof } from "../lib/proofGenerator";
import { submitCustodyProof } from "../lib/zkverify";
import { 
  ShieldCheck, 
  ArrowRight, 
  Wallet, 
  Copy, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Info,
  ExternalLink 
} from "lucide-react";

type Role = "Distributor" | "Wholesaler" | "Pharmacy" | "";

export default function CustodyTransferForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [zkResult, setZkResult] = useState<{ leafDigest: string; aggregationId: number} | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [formData, setFormData] = useState({
    batchId: "",
    recipientRole: "" as Role,
    recipientWallet: "",
    batchData: ["1", "2", "3", "4", "5", "6", "7", "8"],
    entitySecret: "0x123",
    prevCustodianSecret: "0x456"
  });

  // Derived values
  const chainStep = useMemo(() => {
    switch (formData.recipientRole) {
      case "Distributor": return 1;
      case "Wholesaler": return 2;
      case "Pharmacy": return 3;
      default: return 1;
    }
  }, [formData.recipientRole]);

  const isValidWallet = useMemo(() => ethers.isAddress(formData.recipientWallet), [formData.recipientWallet]);

  const generatedEntityHash = useMemo(() => {
    if (!isValidWallet) return "";
    return ethers.keccak256(ethers.toUtf8Bytes(formData.recipientWallet.trim() + "ZKDrugChain"));
  }, [formData.recipientWallet, isValidWallet]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setStatus("Copied to clipboard!");
    setTimeout(() => setStatus(""), 2000);
  };

  const handleGenerateAndSubmitProof = async () => {
    if (!isValidWallet) {
      setStatus("Error: Invalid recipient wallet address.");
      return;
    }
    if (!formData.recipientRole) {
      setStatus("Error: Please select a recipient role.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Generating Noir ZK Proof...");
      
      const handoffTimestamp = Math.floor(Date.now() / 1000).toString();
      
      const inputs = {
        batch_id: formData.batchId,
        entity_id_hash: generatedEntityHash,
        prev_entity_id_hash: formData.prevCustodianSecret,
        handoff_timestamp: handoffTimestamp,
        batch_commitment: "0x789",
        chain_step: chainStep.toString(),
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
        generatedEntityHash,
        zkResult?.leafDigest,
        "0x0000000000000000000000000000000000000000000000000000000000000789", // Mock batchCommitment bytes32
        chainStep,
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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-xl w-full mx-auto shadow-2xl relative overflow-hidden group">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10" />
      
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <ShieldCheck className="text-emerald-400 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">Custody Transfer</h2>
          <p className="text-sm text-slate-500 font-medium">Verify & Handover Medicine Batch</p>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          {/* Batch ID */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest px-1">Source Batch ID</label>
            <div className="relative group/input">
              <input 
                placeholder="0x..."
                value={formData.batchId} 
                onChange={e => setFormData({...formData, batchId: e.target.value})} 
                className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white font-mono text-sm focus:border-emerald-500/50 transition-all outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest px-1">Recipient Role</label>
              <div className="relative">
                <select 
                  value={formData.recipientRole} 
                  onChange={e => setFormData({...formData, recipientRole: e.target.value as Role})} 
                  className="w-full appearance-none px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white text-sm focus:border-emerald-500/50 transition-all outline-none cursor-pointer"
                >
                  <option value="" disabled>Select Role</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Pharmacy">Pharmacy</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Recipient Wallet */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest px-1">Recipient Wallet</label>
              <div className="relative group/input">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  placeholder="0x..."
                  value={formData.recipientWallet} 
                  onChange={e => setFormData({...formData, recipientWallet: e.target.value})} 
                  className="w-full pl-11 pr-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white font-mono text-sm focus:border-emerald-500/50 transition-all outline-none" 
                />
              </div>
            </div>
          </div>

          {/* Auto-generated Hash Preview */}
          {isValidWallet && (
            <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" /> Entity Hash Generated
                </span>
                <button 
                  onClick={() => handleCopy(generatedEntityHash)}
                  className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors group/copy"
                >
                  <Copy className="w-3.5 h-3.5 text-emerald-500 group-hover/copy:scale-110 transition-transform" />
                </button>
              </div>
              <p className="text-[10px] font-mono text-slate-400 break-all leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                {generatedEntityHash}
              </p>
              <p className="mt-2 text-[10px] text-slate-500 italic flex items-center gap-1.5">
                <Info size={12} /> Derived automatically from recipient wallet address.
              </p>
            </div>
          )}

          {/* Flow Summary Card */}
          {formData.recipientRole && (
            <div className="p-6 bg-slate-800/30 border border-slate-700/30 rounded-3xl">
               <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <p className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold mb-1">Current</p>
                    <p className="text-sm font-bold text-slate-300">You</p>
                  </div>
                  <div className="flex flex-col items-center px-4">
                    <ArrowRight className="text-emerald-500" />
                    <span className="text-[8px] font-bold text-emerald-500 py-0.5 px-2 bg-emerald-500/10 rounded-full mt-1">STEP {chainStep}</span>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold mb-1">Next Recipient</p>
                    <p className="text-sm font-bold text-white">{formData.recipientRole}</p>
                  </div>
               </div>
            </div>
          )}

          <button 
            onClick={handleGenerateAndSubmitProof} 
            disabled={loading || !isValidWallet || !formData.recipientRole} 
            className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-20 disabled:grayscale text-white font-heading font-black rounded-2xl shadow-xl shadow-emerald-900/10 hover:shadow-emerald-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                <span>Generate ZK Proof & Verify</span>
              </>
            )}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 py-4 text-center">
          <div className="inline-flex w-20 h-20 bg-emerald-500/10 rounded-full items-center justify-center border border-emerald-500/20 mb-4 animate-pulse">
            <ShieldCheck size={40} className="text-emerald-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">ZK Proof Validated</h3>
            <p className="text-slate-400 max-w-xs mx-auto text-sm">Mathematically verified by zkVerify Mainnet. Your custody transfer is secured.</p>
          </div>

          {/* Advanced Details Dropdown */}
          <div className="bg-black/20 border border-slate-800 rounded-2xl overflow-hidden">
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-6 py-4 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-800/50 transition-colors"
            >
              Advanced Tech Specs
              {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showAdvanced && (
              <div className="p-6 pt-0 text-left space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-600 font-bold">LEAF_DIGEST</p>
                  <p className="text-xs font-mono text-slate-400 break-all bg-slate-800/30 p-2 rounded-lg">{zkResult?.leafDigest}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-600 font-bold">AGGREGATION_ID (zkVerify)</p>
                  <p className="text-xs font-mono text-emerald-500/70 p-2 bg-slate-800/30 rounded-lg inline-block">{zkResult?.aggregationId}</p>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleRecordOnChain} 
            disabled={loading} 
            className="w-full py-5 bg-white text-black hover:bg-slate-100 disabled:opacity-50 font-heading font-black rounded-2xl transition-all shadow-xl active:scale-[0.98]"
          >
            {loading ? "Recording on Horizen EON..." : "Commit Transfer to Blockchain"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12 shadow-2xl shadow-emerald-500/20">
            <CheckCircle2 size={48} className="text-white -rotate-12" />
          </div>
          <h3 className="text-3xl font-heading font-black text-white mb-4 tracking-tight">Transfer Complete</h3>
          <p className="text-slate-400 max-w-sm mx-auto mb-10 leading-relaxed text-sm">
            The cryptographic handoff for this batch is now permanently recorded on the Horizen EON blockchain.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setStep(1)} 
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-sm font-bold transition-all"
            >
              Start New Transfer
            </button>
            <a href="/explorer" className="inline-flex items-center justify-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors">
              <ExternalLink size={14} /> View on Block Explorer
            </a>
          </div>
        </div>
      )}

      {status && (
        <div className="mt-8 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <p className="text-[11px] font-mono text-slate-300 uppercase tracking-widest">{status}</p>
        </div>
      )}
    </div>
  );
}
