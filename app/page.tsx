import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="pt-32 pb-24 px-4 text-center w-full max-w-5xl mx-auto">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20 mb-8 mx-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live on Ethereum Sepolia Testnet
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          Trustless Medicine <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Authentication Layer
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          ZKDrugChain uses Zero-Knowledge proofs to verify pharmaceutical custody handoffs without revealing sensitive supply chain margins, ensuring patient safety globally.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="px-8 py-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Enter App
          </Link>
          <Link href="/demo" className="px-8 py-3.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            🧪 Launch Demo
          </Link>
          <a href="/ZKDrugChain_Flow_Explainer.html" className="px-8 py-3.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-purple-400">
            🎬 View Flow Explainer
          </a>
          <Link href="/verify/scan" className="px-8 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-all flex items-center gap-2">
            Patient Scan QR →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-800/50 border-y border-slate-800 w-full">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3">ZK Privacy</h3>
            <p className="text-slate-400 leading-relaxed">Prove valid custody handoffs and registry status without exposing internal wholesale pricing or exact inventory margins via Noir UltraHonk circuits.</p>
          </div>
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3">zkVerify Universal Proofs</h3>
            <p className="text-slate-400 leading-relaxed">Offloads expensive ZK proof verification from the EVM layer to zkVerify, dramatically reducing transaction costs for supply chain actors.</p>
          </div>
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3">Ethereum Settled</h3>
            <p className="text-slate-400 leading-relaxed">Cryptographic attestations are permanently secured via smart contracts on the Ethereum EVM network for final truth.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
