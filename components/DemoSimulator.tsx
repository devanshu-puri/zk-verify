"use client";

import { useState } from "react";
import { DemoBatch } from "@/lib/demoData";
import { CheckCircle2, AlertCircle, XCircle, ArrowRight } from "lucide-react";

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
            addLog(`❌ ProofRejected event received. Invalid custody chain.`);
            setSimulationState(-2); // Error state
            return;
        }

        await new Promise(r => setTimeout(r, 500));
        addLog(`✅ ProofVerified event received... leaf_digest: ${step.proof}`);
        
        setSimulationState(i + 1);
    }
    
    if (batch.status === "pending") {
         addLog(`⚠️ Chain incomplete. Pending final destination.`);
    } else if (batch.status === "verified") {
         addLog(`✅ Supply chain fully verified. Item Authentic.`);
         setSimulationState(99); // Complete success
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Custody Chain Simulation</h3>
        <button
          onClick={startSimulation}
          disabled={simulationState >= 0 && simulationState < 99 && simulationState !== -2}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-md font-medium transition-all"
        >
          {simulationState === -1 ? "Run Simulation" : "Restart"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Timeline Visualization */}
        <div className="flex-1 space-y-4 relative">
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-700" />
            
            {batch.custody.map((step, idx) => {
                const isActive = simulationState >= idx;
                const isCurrent = simulationState === idx;
                const isError = simulationState === -2 && isCurrent;

                return (
                    <div key={idx} className={`relative flex items-center gap-4 p-3 rounded-lg transition-all ${isCurrent ? 'bg-slate-800' : ''} ${!isActive && simulationState !== -1 ? 'opacity-50' : ''}`}>
                        <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isError ? 'bg-red-500/20 text-red-500' :
                            isActive && !isCurrent ? 'bg-emerald-500/20 text-emerald-500' :
                            isCurrent ? 'bg-indigo-500/20 text-indigo-400 animate-pulse' :
                            'bg-slate-800 text-slate-500'
                        }`}>
                            {isError ? <XCircle size={18} /> : 
                             isActive && !isCurrent ? <CheckCircle2 size={18} /> : 
                             <div className="w-2 h-2 rounded-full bg-current" />}
                        </div>
                        <div className="flex-1">
                            <h4 className={`font-medium ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>{step.step}</h4>
                            <p className="text-sm text-slate-400">{step.entity}</p>
                        </div>
                        {isActive && !isCurrent && !isError && (
                            <div className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">ZK Verified</div>
                        )}
                        {isError && (
                            <div className="text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded">Invalid Proof</div>
                        )}
                    </div>
                )
            })}
        </div>

        {/* Terminal Window */}
        <div className="flex-1 bg-black rounded-lg border border-slate-800 font-mono text-sm p-4 h-[300px] overflow-y-auto">
            <div className="text-slate-500 mb-2">// zkVerify Simulation Logs</div>
            {logs.map((log, i) => (
                <div key={i} className={`mb-1 ${
                    log.includes('✅') ? 'text-emerald-400' : 
                    log.includes('❌') ? 'text-red-400' : 
                    log.includes('⚠️') ? 'text-amber-400' : 
                    'text-slate-300'
                }`}>
                    {'>'} {log}
                </div>
            ))}
            {simulationState >= 0 && simulationState < 99 && simulationState !== -2 && (
                <div className="text-slate-500 animate-pulse">{'>'} _</div>
            )}
        </div>
      </div>
    </div>
  );
}
