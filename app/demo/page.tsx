"use client";

import { useState } from "react";
import { demoMedicines, DemoBatch } from "@/lib/demoData";
import DemoSimulator from "@/components/DemoSimulator";
import DemoQR from "@/components/DemoQR";
import { ShieldAlert, CheckCircle2, FlaskConical, Stethoscope, PackageSearch, Activity, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoPage() {
  const [selectedBatch, setSelectedBatch] = useState<DemoBatch | null>(null);

  const stats = {
    total: demoMedicines.length,
    verified: demoMedicines.filter(m => m.status === 'verified').length,
    pending: demoMedicines.filter(m => m.status === 'pending').length,
    counterfeit: demoMedicines.filter(m => m.status === 'fake').length,
  };

  return (
    <div className="min-h-screen w-full p-6 md:p-12 relative z-10 selection:bg-medical-green selection:text-black">
      <div className="max-w-7xl mx-auto space-y-12 relative">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-medical-green/10"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-green opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-medical-green"></span>
               </span>
               <span className="font-mono text-medical-green text-sm tracking-widest uppercase">System Online</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-black text-white flex items-center gap-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Activity className="text-zk-purple w-10 h-10" />
              Live System Simulation
            </h1>
          </div>
          <div className="bg-surface/50 border border-medical-green/20 backdrop-blur-md rounded-2xl p-4 flex gap-4 text-slate-300 items-start max-w-sm shadow-[0_0_30px_rgba(0,255,156,0.05)]">
            <Stethoscope className="shrink-0 mt-0.5 text-medical-green" size={20} />
            <p className="text-sm font-light leading-relaxed">
              <strong className="text-white font-medium block mb-1">Guided Mode:</strong>
              Select a batch capsule below. The system will visualize its zero-knowledge validation state instantly.
            </p>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <MetricCapsule title="Total Active Batches" value={stats.total} color="border-verification-blue/30" glow="shadow-[0_0_20px_rgba(37,99,235,0.1)]" text="text-verification-blue" delay={0.1} />
           <MetricCapsule title="Verified Nodes" value={stats.verified} color="border-medical-green/40" glow="shadow-[0_0_30px_rgba(0,255,156,0.15)]" text="text-medical-green" delay={0.2} />
           <MetricCapsule title="Pending Handoffs" value={stats.pending} color="border-amber-500/30" glow="shadow-[0_0_20px_rgba(245,158,11,0.1)]" text="text-amber-400" delay={0.3} />
           <MetricCapsule title="Detected Anomalies" value={stats.counterfeit} color="border-danger-red/40" glow="shadow-[0_0_30px_rgba(255,59,59,0.15)]" text="text-danger-red" delay={0.4} />
        </div>

        <div className="grid md:grid-cols-12 gap-10">
          
          {/* Inventory Flow */}
          <div className="md:col-span-4 space-y-6">
            <h2 className="text-sm font-mono tracking-widest text-slate-400 uppercase flex items-center gap-3">
              <span className="h-px bg-slate-700 flex-1"></span>
              Encrypted Registry
              <span className="h-px bg-slate-700 flex-1"></span>
            </h2>
            
            <div className="space-y-4 relative">
              <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-medical-green/50 via-zk-purple/50 to-transparent -z-10 hidden md:block" />
              
              {demoMedicines.map((batch, idx) => (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  key={batch.id}
                  onClick={() => setSelectedBatch(batch)}
                  className={`w-full group relative overflow-hidden rounded-2xl border transition-all duration-300 block text-left ${
                    selectedBatch?.id === batch.id
                      ? 'bg-surface/80 border-medical-green shadow-[0_0_30px_rgba(0,255,156,0.2)] ml-2 md:ml-4'
                      : 'bg-surface/40 border-white/5 hover:border-white/20 hover:bg-surface/60'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${
                    batch.status === 'verified' ? 'from-medical-green/10' :
                    batch.status === 'pending' ? 'from-amber-500/10' :
                    'from-danger-red/10'
                  } to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="relative p-5 z-10 flex items-start gap-4">
                     <div className={`shrink-0 w-3 h-3 rounded-full mt-1.5 ${
                        batch.status === 'verified' ? 'bg-medical-green shadow-[0_0_10px_#00ff9c]' :
                        batch.status === 'pending' ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]' :
                        'bg-danger-red shadow-[0_0_10px_#ff3b3b]'
                     }`} />
                     <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                         <span className="font-heading font-semibold text-lg text-white">{batch.name}</span>
                         {batch.status === 'verified' && <CheckCircle2 size={16} className="text-medical-green" />}
                         {batch.status === 'pending' && <Activity size={16} className="text-amber-400" />}
                         {batch.status === 'fake' && <ShieldAlert size={16} className="text-danger-red animate-pulse" />}
                       </div>
                       <div className="text-xs font-mono text-slate-500 truncate mb-3">ID: {batch.id.substring(0,18)}...</div>
                       <div className="inline-flex items-center px-2 py-1 rounded bg-black/50 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                         {batch.status === 'verified' ? 'Zk Validated' : batch.status === 'pending' ? 'Awaiting Proof' : 'Signature Mismatch'}
                       </div>
                     </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Visualization Chamber */}
          <div className="md:col-span-8 flex flex-col h-full">
            <AnimatePresence mode="wait">
              {!selectedBatch ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-h-[500px] flex flex-col items-center justify-center border border-white/5 rounded-3xl bg-surface/30 backdrop-blur-sm"
                >
                  <PackageSearch className="w-16 h-16 text-slate-700 mb-6" strokeWidth={1} />
                  <p className="text-slate-500 font-mono tracking-wide text-sm">WAITING_FOR_DATA_INPUT</p>
                </motion.div>
              ) : (
                <motion.div 
                  key={selectedBatch.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="flex-1 flex flex-col space-y-6"
                >
                  {/* Glass Header Info */}
                  <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Fingerprint className="w-48 h-48 text-white" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between">
                      <div className="flex-1">
                        <div className="text-medical-green font-mono text-xs tracking-widest mb-3 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-medical-green rounded-full animate-pulse" />
                           ACTIVE TELEMETRY
                        </div>
                        <h2 className="text-4xl font-heading font-black text-white mb-2">{selectedBatch.name}</h2>
                        <p className="text-slate-400 font-medium mb-6">{selectedBatch.brand} • Expires: {selectedBatch.expiry}</p>
                        
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl inline-block max-w-full overflow-hidden">
                           <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Cryptographic Fingerprint (Keccak256)</div>
                           <div className="font-mono text-sm text-zk-purple break-all leading-relaxed">
                             {selectedBatch.id}
                           </div>
                        </div>
                      </div>
                      
                      <div className="shrink-0 bg-white p-4 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center">
                        <DemoQR batchId={selectedBatch.id} />
                      </div>
                    </div>
                  </div>

                  {/* Simulator Injection */}
                  <div className="flex-1 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-3xl p-2 md:p-6 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/90 pointer-events-none z-10 h-12 bottom-0" />
                    <DemoSimulator batch={selectedBatch} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCapsule({ title, value, color, glow, text, delay }: { title: string, value: number, color: string, glow: string, text: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, type: "spring" }}
      className={`bg-surface/50 backdrop-blur-md border ${color} rounded-2xl p-6 relative overflow-hidden group`}
    >
       <div className={`absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${glow}`} />
       <div className="relative z-10">
          <div className="text-slate-400 font-mono text-[10px] uppercase tracking-widest mb-2">{title}</div>
          <div className={`text-4xl font-heading font-black ${text}`}>{value}</div>
       </div>
    </motion.div>
  );
}
