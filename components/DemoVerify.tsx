"use client";

import { useState } from "react";
import { DemoBatch } from "@/lib/demoData";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function DemoVerify({ batch, onReset }: { batch?: DemoBatch; onReset?: () => void }) {
  const [verifying, setVerifying] = useState(true);

  if (verifying) {
    setTimeout(() => setVerifying(false), 2000);
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="relative w-24 h-24 flex items-center justify-center">
           <div className="absolute inset-0 border-4 border-medical-green/20 rounded-full" />
           <div className="absolute inset-0 border-4 border-medical-green border-t-transparent rounded-full animate-spin" />
           <Activity className="text-medical-green animate-pulse w-8 h-8" />
        </div>
        <p className="text-medical-green font-mono uppercase tracking-widest text-sm animate-pulse-glow">
          Synchronizing zk-proof network...
        </p>
      </div>
    );
  }

  if (!batch) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-danger-red/5 border border-danger-red/20 rounded-3xl p-10 text-center max-w-md mx-auto backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-danger-red shadow-[0_0_20px_#ff3b3b]" />
        <XCircle className="w-20 h-20 text-danger-red mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,59,59,0.5)]" />
        <h2 className="text-3xl font-heading font-black text-white mb-3">Registry Fault</h2>
        <p className="text-slate-400 mb-8 font-light">The scanned cryptographic signature produced a zero-knowledge mismatch. Cannot verify authenticity.</p>
        <button onClick={onReset} className="px-8 py-3 bg-danger-red hover:bg-danger-red/80 text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(255,59,59,0.2)]">
          Reset Scanner
        </button>
      </motion.div>
    );
  }

  const isVerified = batch.status === "verified";
  const isPending = batch.status === "pending";
  const isFake = batch.status === "fake";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-3xl p-10 max-w-2xl mx-auto backdrop-blur-xl relative overflow-hidden ${
      isVerified ? 'bg-medical-green/5 shadow-[0_0_50px_rgba(0,255,156,0.1)] border-medical-green/30' :
      isPending ? 'bg-amber-500/5 shadow-[0_0_50px_rgba(245,158,11,0.1)] border-amber-500/30' :
      'bg-danger-red/5 shadow-[0_0_50px_rgba(255,59,59,0.1)] border-danger-red/30'
    }`}>
      {/* Top indicator bar */}
      <div className={`absolute top-0 inset-x-0 h-1.5 ${
        isVerified ? 'bg-medical-green shadow-[0_0_20px_#00ff9c]' :
        isPending ? 'bg-amber-400 shadow-[0_0_20px_#fbbf24]' :
        'bg-danger-red shadow-[0_0_20px_#ff3b3b]'
      }`} />

      <div className="text-center mb-10 relative z-10">
        <div className="inline-block relative">
          {isVerified && <ShieldCheck className="w-24 h-24 text-medical-green mx-auto mb-6 drop-shadow-[0_0_20px_rgba(0,255,156,0.6)]" />}
          {isPending && <AlertTriangle className="w-24 h-24 text-amber-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]" />}
          {isFake && <XCircle className="w-24 h-24 text-danger-red mx-auto mb-6 drop-shadow-[0_0_20px_rgba(255,59,59,0.6)]" />}
          {isVerified && <div className="absolute inset-0 bg-medical-green/20 blur-3xl rounded-full z-[-1]" />}
        </div>
        
        <div className="font-mono text-[10px] tracking-widest text-slate-500 uppercase mb-2">Verification Status</div>
        <h2 className={`text-5xl font-heading font-black tracking-tight mb-4 ${
          isVerified ? 'text-white' :
          isPending ? 'text-white' :
          'text-white'
        }`}>
          {isVerified ? "Authentic" :
           isPending ? "In Transit" :
           "Counterfeit"}
        </h2>
        <p className={`text-lg px-4 py-1.5 rounded-full inline-block border ${
          isVerified ? 'bg-medical-green/10 text-medical-green border-medical-green/20' : 
          isPending ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : 
          'bg-danger-red/10 text-danger-red border-danger-red/20'
        }`}>
          {batch.name} <span className="opacity-50 mx-2">•</span> {batch.batch}
        </p>
      </div>

      <div className="bg-surface/50 border border-white/5 rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-mono tracking-widest text-slate-400 uppercase mb-4 border-b border-white/10 pb-3">Medicine Protocol</h3>
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
          <div>
            <span className="text-slate-500 block text-xs uppercase mb-1">Brand Manufacturer</span>
            <span className="text-white font-bold text-base">{batch.brand}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs uppercase mb-1">Therapeutic Class</span>
            <span className="text-white font-bold text-base">{batch.type}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs uppercase mb-1">Expiration Phase</span>
            <span className="text-white font-bold text-base">{batch.expiry}</span>
          </div>
          <div className="col-span-2 mt-2">
            <span className="text-slate-500 block text-xs uppercase mb-1">Origin Node Hash</span>
            <span className="text-zk-purple font-mono text-xs bg-black/40 p-2 rounded block break-all">{batch.manufacturer}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface/50 border border-white/5 rounded-2xl p-6 relative">
        <h3 className="text-sm font-mono tracking-widest text-slate-400 uppercase mb-4 border-b border-white/10 pb-3">Immutable Timeline</h3>
        <div className="space-y-5">
          {batch.custody.map((step, idx) => (
            <div key={idx} className="flex items-start justify-between group">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {step.status === "verified" ? (
                    <CheckCircle2 className="w-5 h-5 text-medical-green shadow-[0_0_10px_rgba(0,255,156,0.3)] rounded-full" />
                  ) : step.status === "pending" ? (
                    <div className="w-5 h-5 rounded-full border-2 border-amber-400 opacity-50 border-dashed" />
                  ) : (
                    <XCircle className="w-5 h-5 text-danger-red shadow-[0_0_10px_rgba(255,59,59,0.3)] rounded-full" />
                  )}
                </div>
                <div>
                  <p className="text-slate-200 font-bold">{step.step} <span className="opacity-40 px-1">•</span> <span className="font-normal text-slate-400">{step.entity}</span></p>
                  <p className="text-slate-600 font-mono text-[10px] mt-1 group-hover:text-slate-400 transition-colors">Proof: {step.proof.slice(0, 24)}...</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded inline-block ${
                  step.status === "verified" ? "bg-medical-green/10 text-medical-green border border-medical-green/20" :
                  step.status === "fake" ? "bg-danger-red/10 text-danger-red border border-danger-red/20" :
                  "bg-surface text-slate-500 border border-slate-700"
                }`}>
                  {step.status === "verified" ? "Valid ZK" : step.status === "fake" ? "Fault" : "Awaiting"}
                </span>
              </div>
            </div>
          ))}
          {isPending && (
            <div className="text-center pt-6 border-t border-white/5 text-amber-400 text-sm flex items-center justify-center gap-2">
              <Activity className="w-4 h-4 animate-pulse" />
              Awaiting target node confirmation...
            </div>
          )}
        </div>
      </div>
      
      {onReset && (
        <div className="mt-10 text-center relative z-10">
          <button onClick={onReset} className="text-slate-500 hover:text-white uppercase tracking-widest text-[10px] font-mono border-b border-transparent hover:border-white pb-1 transition-all">
            Terminate Session & Scan New
          </button>
        </div>
      )}
    </motion.div>
  );
}
