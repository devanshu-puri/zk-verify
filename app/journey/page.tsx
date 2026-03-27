"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Database, Fingerprint, Link as LinkIcon, Shield,
  Network, AlertTriangle, QrCode, Smartphone,
  CheckCircle2, Play, Pause
} from "lucide-react";
import Link from "next/link";

export default function JourneyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Scale map 0 to 1 across 9 stages.
  // We'll use the progress to fade elements in and out.
  const step = useTransform(scrollYProgress, 
    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const stageHeight = totalHeight / 9;
        const currentStage = Math.round(currentScroll / stageHeight);
        
        let nextStage = currentStage + 1;
        if (nextStage > 9) nextStage = 0; // loop back to start

        window.scrollTo({
          top: nextStage * stageHeight,
          behavior: 'smooth'
        });
      }, 5000); // 5 seconds per slide
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);
  
  return (
    <div ref={containerRef} className="relative w-full h-[1000vh] bg-[#0a0f1f] selection:bg-[#00ff88] selection:text-black">
      
      {/* AutoPlay Control */}
      <div className="fixed top-24 left-6 z-50 pointer-events-auto">
        <button 
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all border ${
            isAutoPlaying 
              ? 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/50 shadow-[0_0_15px_rgba(0,255,136,0.3)]' 
              : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isAutoPlaying ? "AutoPlaying (5s delay)" : "Start AutoPlay"}
        </button>
      </div>
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#0a0f1f,#02050a)]" />
        <div className="absolute inset-0 opacity-[0.03] animate-pulse bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Glow Effects */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-20"
          style={{
            background: useTransform(step,
              [0, 2, 4, 6, 8],
              ["#00aaff", "#a855f7", "#00ff88", "#ff3355", "#00ff88"]
            )
          }}
        />
      </div>



      {/* Cinematic Stages container */}
      <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
        
        {/* Stage 1: Data Origin */}
        <StageWrapper progress={step} index={0}>
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 1.5 }}
              className="w-32 h-32 rounded-full bg-[#00aaff]/20 border border-[#00aaff]/50 shadow-[0_0_50px_rgba(0,170,255,0.4)] flex items-center justify-center mb-8"
            >
              <Database className="w-12 h-12 text-[#00aaff]" />
            </motion.div>
            <div className="flex gap-4 mb-12">
              <span className="text-white text-lg bg-white/5 px-4 py-2 rounded-lg border border-white/10">Amoxicillin</span>
              <span className="text-white text-lg bg-white/5 px-4 py-2 rounded-lg border border-white/10">Batch: A-99</span>
              <span className="text-white text-lg bg-white/5 px-4 py-2 rounded-lg border border-white/10">Exp: 2026</span>
            </div>
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-4">Data Origin</h2>
            <p className="text-[#a8b3cf] text-xl">The manufacturer initializes the medicine data parameters.</p>
          </div>
        </StageWrapper>

        {/* Stage 2: Transformation */}
        <StageWrapper progress={step} index={1}>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-12">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-dashed border-[#a855f7]" />
               <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-4 rounded-full border border-[#00aaff] opacity-50" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Fingerprint className="w-16 h-16 text-[#a855f7]" />
               </div>
            </div>
            <div className="font-mono text-2xl text-[#00aaff] mb-8 tracking-widest bg-blue-500/10 px-6 py-3 rounded-xl border border-blue-500/20 shadow-[0_0_30px_rgba(0,170,255,0.2)]">
               0xa3f9b2c89e...
            </div>
            <h2 className="text-5xl font-extrabold text-white mb-4">Cryptographic Hash</h2>
            <p className="text-[#a8b3cf] text-xl">Data is merged into a single, irreversible digital fingerprint.</p>
          </div>
        </StageWrapper>

        {/* Stage 3: Blockchain Encoding */}
        <StageWrapper progress={step} index={2}>
          <div className="flex flex-col items-center">
             <motion.div 
               initial={{ y: -50, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               className="flex items-center gap-2 mb-12"
             >
               <div className="w-24 h-24 bg-zinc-900 border-2 border-zinc-700 rounded-xl flex items-center justify-center"><LinkIcon className="text-zinc-500 w-8 h-8"/></div>
               <div className="w-16 h-2 bg-gradient-to-r from-zinc-700 to-[#00ff88]" />
               <div className="w-32 h-32 bg-[#00ff88]/10 border-2 border-[#00ff88] rounded-xl flex items-center justify-center shadow-[0_0_40px_rgba(0,255,136,0.3)]">
                 <LinkIcon className="text-[#00ff88] w-12 h-12" />
               </div>
               <div className="w-16 h-2 bg-gradient-to-r from-[#00ff88] to-zinc-700" />
               <div className="w-24 h-24 bg-zinc-900 border-2 border-zinc-700 rounded-xl flex items-center justify-center"><LinkIcon className="text-zinc-500 w-8 h-8"/></div>
             </motion.div>
             <h2 className="text-5xl font-extrabold text-[#00ff88] mb-4 drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]">Immutable Ledger</h2>
             <p className="text-white/70 text-xl font-medium tracking-wide">The hash anchors to the Ethereum network permanently.</p>
             <div className="mt-8 px-4 py-1.5 rounded-full border border-zinc-700 text-xs font-mono text-zinc-500 uppercase tracking-widest">On-Chain</div>
          </div>
        </StageWrapper>

        {/* Stage 4: ZK Proof Generation */}
        <StageWrapper progress={step} index={3}>
          <div className="w-full max-w-5xl px-8 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 bg-black/40 border border-red-500/20 rounded-2xl p-8 backdrop-blur border-dashed relative">
               <div className="absolute -top-3 -left-3 px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">PRIVATE</div>
               <Shield className="w-12 h-12 text-red-400 mb-6" />
               <div className="space-y-4">
                 <div className="h-4 w-3/4 bg-red-500/20 rounded" />
                 <div className="h-4 w-1/2 bg-red-500/20 rounded" />
                 <div className="h-4 w-5/6 bg-red-500/20 rounded" />
               </div>
            </div>
            
            <div className="hidden md:flex flex-col items-center justify-center gap-2">
               <motion.div animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-8 h-8 text-[#a855f7]">►</motion.div>
               <span className="text-[#a855f7] font-mono text-xs font-bold border border-[#a855f7]/30 px-3 py-1 rounded-full bg-[#a855f7]/10">Noir Circuit</span>
            </div>

            <div className="flex-1 bg-black/40 border border-[#a855f7]/30 rounded-2xl p-8 backdrop-blur relative shadow-[0_0_50px_rgba(168,85,247,0.15)]">
               <div className="absolute -top-3 -right-3 px-3 py-1 bg-[#a855f7]/20 text-[#a855f7] text-xs font-bold rounded">PUBLIC PROOF</div>
               <div className="text-4xl text-[#a855f7] mb-6">π</div>
               <div className="font-mono text-xs text-[#a855f7]/70 break-all leading-relaxed">
                  0x04bf...822a 0x3277...d8bc
                  0x20ab...cdff 0x0566...814c
                  0x483f...9656 0x9b2a...4cd0
               </div>
            </div>
          </div>
          <div className="mt-16 text-center">
            <h2 className="text-4xl font-extrabold text-white mb-2">Zero-Knowledge Generation</h2>
            <p className="text-[#a8b3cf]">Mathematical certainty without exposing sensitive trade secrets.</p>
            <div className="mt-6 inline-block px-4 py-1.5 rounded-full border border-[#a855f7]/50 text-xs font-mono text-[#a855f7] uppercase tracking-widest bg-[#a855f7]/10">ZK Layer</div>
          </div>
        </StageWrapper>

        {/* Stage 5: zkVerify */}
        <StageWrapper progress={step} index={4}>
          <div className="flex flex-col items-center">
             <div className="relative w-[600px] h-[300px] flex items-center justify-center mb-8">
                {/* Network nodes mapping */}
                {[...Array(12)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                    className="absolute w-3 h-3 bg-[#00ff88] rounded-full shadow-[0_0_10px_#00ff88]"
                    style={{
                      top: `${Math.random() * 80 + 10}%`,
                      left: `${Math.random() * 80 + 10}%`
                    }}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff88]/10 to-transparent" />
                <Network className="w-20 h-20 text-[#00ff88] relative z-10 drop-shadow-[0_0_20px_#00ff88]" />
             </div>
             <h2 className="text-5xl font-extrabold text-white mb-4">zkVerify Network</h2>
             <p className="text-[#a8b3cf] text-xl">Decentralized nodes rapidly validate the cryptographic proof off-chain.</p>
          </div>
        </StageWrapper>

        {/* Stage 6: Counterfeit Attack */}
        <StageWrapper progress={step} index={5}>
          <div className="flex flex-col items-center">
             <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
                <motion.div 
                   animate={{ x: [-5, 5, -5, 5, 0] }}
                   transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
                   className="absolute inset-0 border-4 border-[#ff3355] rounded-full opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden mix-blend-screen text-[#ff3355]/30 text-[10rem] font-bold tracking-tighter">
                   ERROR
                </div>
                <AlertTriangle className="w-24 h-24 text-[#ff3355] drop-shadow-[0_0_30px_#ff3355]" />
             </div>
             <h2 className="text-5xl font-extrabold text-[#ff3355] drop-shadow-[0_0_15px_rgba(255,51,85,0.4)] mb-4 uppercase tracking-tight">Access Denied</h2>
             <p className="text-[#a8b3cf] text-xl">Counterfeit injections fail signature validation instantly. The chain breaks.</p>
          </div>
        </StageWrapper>

        {/* Stage 7: QR Generation */}
        <StageWrapper progress={step} index={6}>
          <div className="flex flex-col items-center">
             <div className="bg-white p-6 rounded-3xl shadow-[0_0_60px_rgba(255,255,255,0.2)] mb-12 transition-transform hover:scale-110 duration-500 cursor-pointer">
                <QrCode className="w-32 h-32 text-black" />
             </div>
             <h2 className="text-5xl font-extrabold text-white mb-4">Patient Interface</h2>
             <p className="text-[#a8b3cf] text-xl">Verified authenticity bound to a physical QR trigger.</p>
             <div className="mt-6 px-4 py-1.5 rounded-full border border-white/20 text-xs font-mono text-zinc-400 uppercase tracking-widest bg-white/5">Off-Chain</div>
          </div>
        </StageWrapper>

        {/* Stage 8: Patient Scan */}
        <StageWrapper progress={step} index={7}>
          <div className="flex flex-col items-center">
             <div className="relative mb-12">
                <Smartphone className="w-32 h-32 text-white opacity-80" strokeWidth={1} />
                <motion.div 
                  className="absolute inset-x-0 h-1 bg-[#00ff88] shadow-[0_0_20px_#00ff88]"
                  animate={{ top: ['20%', '80%', '20%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
             </div>
             <h2 className="text-5xl font-extrabold text-white mb-4">The Verification</h2>
             <p className="text-[#a8b3cf] text-xl">The user bridges physical medicine to its digital cryptographic history via mobile scan.</p>
          </div>
        </StageWrapper>

        {/* Stage 9: Truth Output */}
        <StageWrapper progress={step} index={8}>
          <div className="flex flex-col items-center">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               transition={{ type: "spring", bounce: 0.5 }}
               className="bg-gradient-to-b from-[#00ff88]/10 to-transparent border border-[#00ff88]/30 rounded-3xl p-12 text-center backdrop-blur-xl shadow-[0_0_80px_rgba(0,255,136,0.15)] w-full max-w-xl mb-12 relative overflow-hidden"
             >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-50" />
                <CheckCircle2 className="w-24 h-24 text-[#00ff88] mx-auto mb-6 drop-shadow-[0_0_20px_rgba(0,255,136,0.5)]" />
                <h2 className="text-4xl font-black text-white mb-3">AUTHENTIC MEDICINE</h2>
                <div className="text-[#00ff88] font-medium tracking-wide">VERIFIED BY ZERO-KNOWLEDGE PROOFS</div>
             </motion.div>
             <p className="text-zinc-500 font-mono">Final confirmation without trusting a central server.</p>
          </div>
        </StageWrapper>
        
        {/* Final Message */}
        <StageWrapper progress={step} index={9}>
           <div className="flex flex-col items-center justify-center text-center space-y-6">
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-600 leading-tight">
                 No database to hack.<br />
                 No QR to clone.<br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00aaff]">Just math.</span>
              </h1>
              
              <Link href="/demo" className="mt-16 group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/20 to-[#00aaff]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                 Launch Interactive Demo →
              </Link>
           </div>
        </StageWrapper>

      </div>

      {/* Progress Indicators */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 pointer-events-auto">
        {[...Array(10)].map((_, i) => (
           <NavDot key={i} index={i} progress={step} />
        ))}
      </div>
    </div>
  );
}

function StageWrapper({ children, progress, index }: { children: React.ReactNode, progress: any, index: number }) {
  // Each stage is fully visible when progress is within [index - 0.2, index, index + 0.2]
  // and fades out outside that range.
  const opacity = useTransform(
    progress,
    [index - 0.8, index - 0.2, index, index + 0.2, index + 0.8],
    [0, 1, 1, 1, 0]
  );
  
  const y = useTransform(
    progress,
    [index - 1, index, index + 1],
    [100, 0, -100]
  );

  const scale = useTransform(
    progress,
    [index - 1, index, index + 1],
    [0.9, 1, 1.1]
  );

  return (
    <motion.div 
      style={{ opacity, y, scale }} 
      className="absolute inset-0 flex items-center justify-center pointer-events-auto"
    >
      {children}
    </motion.div>
  );
}

function NavDot({ index, progress }: { index: number, progress: any }) {
  const activeOpacity = useTransform(progress, 
    [index - 0.5, index, index + 0.5], 
    [0.3, 1, 0.3]
  );
  const activeScale = useTransform(progress, 
    [index - 0.5, index, index + 0.5], 
    [1, 1.5, 1]
  );

  return (
    <motion.button 
      style={{ opacity: activeOpacity, scale: activeScale }}
      onClick={() => {
         window.scrollTo({
           top: index * (document.body.scrollHeight / 10),
           behavior: 'smooth'
         })
      }}
      className="w-2 h-2 rounded-full bg-white transition-colors hover:bg-[#00ff88]"
    />
  );
}
