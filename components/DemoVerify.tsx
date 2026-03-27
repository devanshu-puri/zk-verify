"use client";

import { useState } from "react";
import { DemoBatch } from "@/lib/demoData";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from "lucide-react";

export default function DemoVerify({ batch, onReset }: { batch?: DemoBatch; onReset?: () => void }) {
  const [verifying, setVerifying] = useState(true);

  // Simulate verification delay
  if (verifying) {
    setTimeout(() => setVerifying(false), 1500);
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 animate-pulse">Verifying cryptographic custody chain...</p>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center max-w-md mx-auto">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Invalid Batch ID</h2>
        <p className="text-red-400 mb-6">The scanned cryptographic hash does not exist in our registry.</p>
        <button onClick={onReset} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all">Scan Again</button>
      </div>
    );
  }

  const isVerified = batch.status === "verified";
  const isPending = batch.status === "pending";
  const isFake = batch.status === "fake";

  return (
    <div className={`border rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl ${
      isVerified ? 'bg-emerald-500/5 shadow-emerald-500/10 border-emerald-500/20' :
      isPending ? 'bg-amber-500/5 shadow-amber-500/10 border-amber-500/20' :
      'bg-red-500/5 shadow-red-500/10 border-red-500/20'
    }`}>
      <div className="text-center mb-8">
        {isVerified && <ShieldCheck className="w-20 h-20 text-emerald-500 mx-auto mb-4" />}
        {isPending && <AlertTriangle className="w-20 h-20 text-amber-500 mx-auto mb-4" />}
        {isFake && <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />}
        
        <h2 className={`text-3xl font-extrabold mb-2 ${
          isVerified ? 'text-emerald-400' :
          isPending ? 'text-amber-400' :
          'text-red-400'
        }`}>
          {isVerified ? "Authentic Medicine" :
           isPending ? "Chain Incomplete" :
           "Counterfeit Detected"}
        </h2>
        <p className="text-slate-400">{batch.name} • {batch.batch}</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Medicine Detail</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500 block">Brand</span>
            <span className="text-slate-300 font-medium">{batch.brand}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Type</span>
            <span className="text-slate-300 font-medium">{batch.type}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Expiry Date</span>
            <span className="text-slate-300 font-medium">{batch.expiry}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Manufacturer Hash</span>
            <span className="text-slate-300 font-mono text-xs">{batch.manufacturer}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Custody Chain History</h3>
        <div className="space-y-4">
          {batch.custody.map((step, idx) => (
            <div key={idx} className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {step.status === "verified" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : step.status === "pending" ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-slate-200 font-medium">{step.step} • {step.entity}</p>
                  <p className="text-slate-500 text-xs mt-1">Proof: {step.proof.slice(0, 16)}...</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  step.status === "verified" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                  step.status === "fake" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                  "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                }`}>
                  {step.status === "verified" ? "ZK Confirmed" : "Invalid Proof"}
                </span>
              </div>
            </div>
          ))}
          {isPending && (
            <div className="text-center pt-4 border-t border-slate-800 border-dashed text-amber-500 text-sm">
              Waiting for Pharmacy receipt...
            </div>
          )}
        </div>
      </div>
      
      {onReset && (
        <div className="mt-8 text-center">
          <button onClick={onReset} className="text-slate-400 hover:text-white underline text-sm">Scan another batch</button>
        </div>
      )}
    </div>
  );
}
