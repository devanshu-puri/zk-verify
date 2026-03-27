"use client";

import { useState } from "react";
import { demoMedicines, DemoBatch } from "@/lib/demoData";
import DemoSimulator from "@/components/DemoSimulator";
import DemoQR from "@/components/DemoQR";
import { ShieldAlert, CheckCircle2, FlaskConical, Stethoscope, PackageSearch } from "lucide-react";

export default function DemoPage() {
  const [selectedBatch, setSelectedBatch] = useState<DemoBatch | null>(null);

  const stats = {
    total: demoMedicines.length,
    verified: demoMedicines.filter(m => m.status === 'verified').length,
    pending: demoMedicines.filter(m => m.status === 'pending').length,
    counterfeit: demoMedicines.filter(m => m.status === 'fake').length,
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
              <FlaskConical className="text-indigo-400" size={32} />
              Demo Mode
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              Explore preloaded medicine supply chains simulated with Zero-Knowledge Proofs.
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex gap-4 text-indigo-300 items-start">
          <Stethoscope className="shrink-0 mt-0.5" />
          <p className="text-sm">
            <strong>Demo Script:</strong> “Each medicine is assigned a cryptographic batch ID stored on-chain. Using Zero-Knowledge Proofs, we verify custody transitions without exposing sensitive data. If any step is compromised, the system flags it instantly.”
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
             <div className="text-slate-400 text-sm mb-1">Total Batches</div>
             <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-900/30 p-6 rounded-xl">
             <div className="text-emerald-400 text-sm mb-1">Verified</div>
             <div className="text-3xl font-bold text-emerald-300">{stats.verified}</div>
          </div>
          <div className="bg-amber-900/20 border border-amber-900/30 p-6 rounded-xl">
             <div className="text-amber-400 text-sm mb-1">Pending</div>
             <div className="text-3xl font-bold text-amber-300">{stats.pending}</div>
          </div>
          <div className="bg-red-900/20 border border-red-900/30 p-6 rounded-xl">
             <div className="text-red-400 text-sm mb-1">Counterfeit</div>
             <div className="text-3xl font-bold text-red-300">{stats.counterfeit}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Inventory List */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <PackageSearch size={20} />
              Preloaded Inventory
            </h2>
            <div className="space-y-3">
              {demoMedicines.map((batch) => (
                <button
                  key={batch.id}
                  onClick={() => setSelectedBatch(batch)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedBatch?.id === batch.id
                      ? 'bg-slate-800 border-indigo-500/50 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-white">{batch.name}</span>
                    {batch.status === 'verified' && <CheckCircle2 size={18} className="text-emerald-500" />}
                    {batch.status === 'pending' && <CheckCircle2 size={18} className="text-amber-500" />}
                    {batch.status === 'fake' && <ShieldAlert size={18} className="text-red-500" />}
                  </div>
                  <div className="text-xs text-slate-500 mb-2">Batch: {batch.batch}</div>
                  
                  <div className="flex gap-2 text-xs font-mono text-slate-400">
                    <span className={`px-2 py-0.5 rounded-full ${
                      batch.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400' :
                      batch.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {batch.status.toUpperCase()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Flow */}
          <div className="md:col-span-2 space-y-6">
            {!selectedBatch ? (
              <div className="h-full min-h-[400px] flex items-center justify-center border border-slate-800 border-dashed rounded-xl bg-slate-900/50 text-slate-500">
                Select a medicine from the inventory to explore its supply chain.
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Batch Header Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedBatch.name}</h2>
                    <p className="text-slate-400 mb-4">{selectedBatch.brand} • Expires: {selectedBatch.expiry}</p>
                    <div className="text-xs text-slate-500 font-mono break-all inline-block bg-black p-2 rounded border border-slate-800">
                      ID: {selectedBatch.id}
                    </div>
                  </div>
                  
                  {/* QR Demo */}
                  <div className="shrink-0 flex flex-col items-center">
                    <span className="text-xs text-slate-500 mb-2 font-medium">SCAN TO VERIFY</span>
                    <DemoQR batchId={selectedBatch.id} />
                  </div>
                </div>

                {/* Simulation Component */}
                <DemoSimulator batch={selectedBatch} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
