"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Fingerprint, Network } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-24 pb-16 relative">
      
      {/* Cinematic Hero */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 text-center relative mb-32">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: "easeOut" }}
        >
           <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-500 mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              Every medicine <br/>
              has a story.
           </h1>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 0.5 }}
        >
           <p className="text-2xl md:text-3xl text-medical-green font-light tracking-wide mb-12 drop-shadow-[0_0_15px_rgba(0,255,156,0.3)]">
              We make it verifiable.
           </p>
        </motion.div>

        {/* Floating Data Nodes Animation */}
        <div className="relative w-full h-[200px] flex items-center justify-center pointer-events-none perspective-1000">
           <motion.div 
             animate={{ rotateY: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute w-64 h-64 border border-medical-green/20 rounded-full"
             style={{ transformStyle: 'preserve-3d' }}
           />
           <motion.div 
             animate={{ rotateX: 360 }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="absolute w-48 h-48 border border-zk-purple/30 rounded-full"
             style={{ transformStyle: 'preserve-3d' }}
           />
           <div className="absolute w-2 h-2 bg-medical-green rounded-full shadow-[0_0_20px_#00ff9c] animate-pulse-glow" />
           <div className="absolute w-[300px] h-[1px] bg-gradient-to-r from-transparent via-medical-green to-transparent opacity-50" />
        </div>

        {/* Primary Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mt-12 relative z-20 pointer-events-auto"
        >
          <Link href="/demo" className="group relative px-8 py-4 rounded-full bg-medical-green/10 border border-medical-green text-medical-green font-heading font-bold text-lg overflow-hidden transition-all hover:bg-medical-green hover:text-black hover:shadow-[0_0_30px_rgba(0,255,156,0.5)]">
            <span className="relative z-10">Live System Simulation</span>
            <div className="absolute inset-0 bg-medical-green transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ease-out duration-300 z-0" />
          </Link>
          <Link href="/journey" className="px-8 py-4 rounded-full bg-surface/50 backdrop-blur-md border border-slate-700 text-white font-heading font-semibold text-lg hover:border-zk-purple transition-all hover:bg-zk-purple/10 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]">
            Explore Documentation
          </Link>
        </motion.div>
      </section>

      {/* Layered Floating Features */}
      <section className="w-full max-w-6xl mx-auto px-6 relative z-10 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <FeatureCapsule 
             icon={<Fingerprint className="text-medical-green w-8 h-8" />}
             title="Cryptographic Fingerprints"
             delay={0.2}
           />
           <FeatureCapsule 
             icon={<Shield className="text-zk-purple w-8 h-8" />}
             title="Zero-Knowledge Proofs"
             delay={0.4}
           />
           <FeatureCapsule 
             icon={<Network className="text-verification-blue w-8 h-8" />}
             title="Decentralized Validation"
             delay={0.6}
           />
        </div>
      </section>
      
    </div>
  );
}

function FeatureCapsule({ icon, title, delay }: { icon: React.ReactNode, title: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="relative group p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-700 to-transparent hover:from-medical-green hover:to-zk-purple transition-colors duration-500"
    >
       <div className="bg-surface/90 backdrop-blur-xl rounded-2xl p-8 h-full flex flex-col items-center text-center relative z-10">
          <div className="mb-6 bg-slate-800/50 p-4 rounded-full group-hover:bg-slate-800 transition-colors">
            {icon}
          </div>
          <h3 className="text-xl font-heading font-semibold text-slate-200 group-hover:text-white transition-colors">
            {title}
          </h3>
          <div className="mt-4 absolute inset-0 bg-gradient-to-b from-medical-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
       </div>
    </motion.div>
  );
}
