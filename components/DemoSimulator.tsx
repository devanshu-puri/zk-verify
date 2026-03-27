"use client";

import { useState } from "react";
import { DemoBatch } from "@/lib/demoData";
import { CheckCircle2, AlertCircle, XCircle, ArrowRight, Play, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoSimulator({ batch }: { batch: DemoBatch }) {
  const [simulationState, setSimulationState] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const startSimulation = async () => {
    setSimulationState(0);
    setLogs([]);
    
    const steps = batch.custody;
    
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        await new Promise(r => setTimeout(r, 600));
        addLog(`Initiating ${step.step} transfer by ${step.entity}...`);
        
        await new Promise(r => setTimeout(r, 800));
        addLog(`Generating Noir proof for transition...`);
        
        await new Promise(r => setTimeout(r, 1000));
        addLog(`Submitting to zkVerify for verification...`);
        
        if (step.status === "fake") {
            await new Promise(r => setTimeout(r, 500));
            addLog(`[ERROR] ProofRejected event received. Invalid custody chain.`);
            setSimulationState(-2); // Error state
            return;
        }

        await new Promise(r => setTimeout(r, 500));
        addLog(`[OK] ProofVerified event received... leaf_digest: ${step.proof.substring(0,24)}...`);
        
        setSimulationState(i + 1);
    }
    
    if (batch.status === "pending") {
         addLog(`[WARN] Chain incomplete. Pending final destination.`);
    } else if (batch.status === "verified") {
         addLog(`[SYSTEM] Supply chain fully verified. Item Authentic.`);
         setSimulationState(99); // Complete success
    }
  };

  return (
    <div className="w-full h-full flex flex-col pt-4">
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-xl font-heading font-black text-white flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-verification-blue animate-pulse" />
          Validation Sequence
        </h3>
        <button
          onClick={startSimulation}
          disabled={simulationState >= 0 && simulationState < 99 && simulationState !== -2}
          className="group relative px-6 py-2.5 bg-surface/80 border border-verification-blue/50 hover:bg-verification-blue/10 disabled:opacity-40 disabled:hover:bg-surface/80 rounded-full font-heading text-sm text-verification-blue font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(37,99,235,0.1)] hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2 overflow-hidden"
        >
          {simulationState === -1 ? (
             <><Play size={14} className="fill-verification-blue" /> Initialize Test</>
          ) : (
             <><RotateCcw size={14} /> Reset System</>
          )}
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 h-full min-h-[400px]">
        {/* Timeline Visualization */}
        <div className="flex-1 space-y-4 relative pl-2">
            <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-slate-700 via-slate-600 to-transparent" />
            
            {batch.custody.map((step, idx) => {
                const isActive = simulationState >= idx;
                const isCurrent = simulationState === idx;
                const isError = simulationState === -2 && isCurrent;

                return (
                    <motion.div 
                        key={idx} 
                        initial={{ opacity: 0.5, x: -10 }}
                        animate={{ opacity: isActive ? 1 : 0.4, x: isActive ? 0 : -10 }}
                        className={`relative z-10 flex items-center gap-5 p-3 rounded-2xl transition-all duration-500 ${isCurrent ? 'bg-surface/80 border border-white/10 shadow-lg scale-[1.02]' : 'bg-transparent border border-transparent'}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-500 ${
                            isError ? 'bg-danger-red/20 border-danger-red text-danger-red shadow-[0_0_15px_rgba(255,59,59,0.3)]' :
                            isActive && !isCurrent ? 'bg-medical-green/10 border-medical-green text-medical-green shadow-[0_0_15px_rgba(0,255,156,0.2)]' :
                            isCurrent ? 'bg-zk-purple/20 border-zk-purple text-zk-purple animate-pulse shadow-[0_0_15px_rgba(124,58,237,0.3)]' :
                            'bg-surface border-slate-700 text-slate-500'
                        }`}>
                            {isError ? <XCircle size={18} /> : 
                             isActive && !isCurrent ? <CheckCircle2 size={18} /> : 
                             <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                        </div>
                        <div className="flex-1">
                            <h4 className={`font-heading font-bold text-sm ${isActive ? 'text-white' : 'text-slate-500'}`}>{step.step}</h4>
                            <p className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>{step.entity}</p>
                        </div>
                        
                        <AnimatePresence>
                            {isActive && !isCurrent && !isError && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    className="text-[10px] uppercase tracking-widest font-mono font-bold text-medical-green bg-medical-green/10 px-2.5 py-1 rounded"
                                >
                                    Zk Validated
                                </motion.div>
                            )}
                            {isError && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    className="text-[10px] uppercase tracking-widest font-mono font-bold text-danger-red bg-danger-red/10 px-2.5 py-1 rounded border border-danger-red/20"
                                >
                                    Fatal Error
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )
            })}
        </div>

        {/* Terminal Window */}
        <div className="flex-1 min-w-[300px] h-full bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex flex-col shadow-inner">
            <div className="flex gap-2 items-center mb-4 pb-3 border-b border-white/5">
               <div className="w-2.5 h-2.5 rounded-full bg-slate-700 hover:bg-danger-red transition-colors" />
               <div className="w-2.5 h-2.5 rounded-full bg-slate-700 hover:bg-amber-400 transition-colors" />
               <div className="w-2.5 h-2.5 rounded-full bg-slate-700 hover:bg-medical-green transition-colors" />
               <span className="ml-3 font-mono text-[10px] text-slate-500 tracking-widest uppercase">Verification_Node_x64</span>
            </div>
            
            <div className="flex-1 overflow-y-auto font-mono text-xs leading-relaxed space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
                <div className="text-slate-600 mb-2">Executing strict mode... Connected to zkVerify node instance.</div>
                {logs.map((log, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`
                            ${log.includes('[OK]') ? 'text-medical-green' : 
                              log.includes('[ERROR]') ? 'text-danger-red font-bold bg-danger-red/5 p-1 rounded' : 
                              log.includes('[WARN]') ? 'text-amber-400' : 
                              log.includes('[SYSTEM]') ? 'text-zk-purple font-bold' : 
                              'text-slate-300'}
                        `}
                    >
                        <span className="opacity-40 mr-2">{'>'}</span>{log}
                    </motion.div>
                ))}
                {simulationState >= 0 && simulationState < 99 && simulationState !== -2 && (
                    <div className="text-medical-green animate-pulse mt-1"><span className="opacity-40 mr-2">{'>'}</span>_</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
