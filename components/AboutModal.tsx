"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function AboutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-medium text-sm transition-colors border border-emerald-500/20"
      >
        About this Project
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-emerald-500 text-slate-900 flex items-center justify-center text-xs">ZK</span>
              About ZKDrugChain
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-10 text-slate-300 overflow-y-auto">
            
            {/* The Problem */}
            <section>
              <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <span className="text-rose-500 text-2xl">⚠</span> The Problem
              </h3>
              <p className="text-lg leading-relaxed mb-4 text-white">
                Every year 1 in 10 medicines sold globally is fake or substandard. People are dying from counterfeit cancer drugs, fake insulin, and diluted antibiotics — worth over $200 billion in fraud annually.
              </p>
              <p className="mb-4 font-medium text-slate-400">The current system fails because:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1">✗</span>
                  <span><strong>QR codes on medicine boxes are easily copied</strong> by fraudsters</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1">✗</span>
                  <span><strong>Track-and-trace databases are centralized</strong> — any company in the chain can lie</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1">✗</span>
                  <span><strong>Patients have no way to verify</strong> if their medicine is real at the pharmacy counter</span>
                </li>
              </ul>
            </section>

            {/* Our Solution */}
            <section className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Our Solution — ZKDrugChain</h3>
              <p className="text-lg leading-relaxed text-white">
                We built a system where every medicine batch carries a mathematical proof — not just a sticker or QR code — that is <strong className="text-emerald-400">impossible to fake</strong>.
              </p>
            </section>

            {/* How it Works */}
            <section>
              <h3 className="text-xl font-bold text-emerald-400 mb-6">How It Works</h3>
              
              <div className="space-y-6">
                <div className="border border-slate-700 p-5 rounded-lg">
                  <h4 className="font-bold text-white mb-2 text-lg">1. Home Page: Trustless Authentication</h4>
                  <p className="text-sm">Explains the mission in one line — verifying medicines using Zero-Knowledge proofs without revealing anyone's trade secrets.</p>
                </div>

                <div className="border border-slate-700 p-5 rounded-lg">
                  <h4 className="font-bold text-white mb-4 text-lg">2. Supply Chain Dashboard</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-800 text-slate-300">
                        <tr>
                          <th className="px-4 py-2 rounded-tl">Action</th>
                          <th className="px-4 py-2">Who uses it</th>
                          <th className="px-4 py-2 rounded-tr">What it does</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        <tr>
                          <td className="px-4 py-3 font-medium text-white">Register Batch</td>
                          <td className="px-4 py-3">Manufacturer</td>
                          <td className="px-4 py-3 text-slate-400">Logs a new drug batch onto the blockchain with a unique immutable ID.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-white">Transfer Custody</td>
                          <td className="px-4 py-3">Distributors / Pharmacies</td>
                          <td className="px-4 py-3 text-slate-400">Generates a ZK proof for each handoff in the supply chain without revealing secrets.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-white">Admin Panel</td>
                          <td className="px-4 py-3">System Owner</td>
                          <td className="px-4 py-3 text-slate-400">Registers trusted entities into the system to prevent fake custody injections.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border border-slate-700 p-5 rounded-lg border-l-4 border-l-emerald-500">
                  <h4 className="font-bold text-white mb-2 text-lg">3. The Core Innovation: ZK Custody Transfer</h4>
                  <p className="text-sm mb-3">Used by Distributors, Wholesalers, and Pharmacies whenever medicine changes hands.</p>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-slate-400">
                    <li>The sender enters the Batch ID, receiver's hash, and chain step.</li>
                    <li>A <strong className="text-white">Noir Zero-Knowledge proof</strong> is generated locally.</li>
                    <li>Proves the transfer is legitimate without revealing pricing or supplier identity.</li>
                    <li>Submitted to zkVerify (under 1 second).</li>
                    <li>Attestation is stored permanently on the blockchain.</li>
                  </ul>
                </div>

                <div className="bg-slate-800 p-5 rounded-lg">
                  <h4 className="font-bold text-emerald-400 mb-2 text-lg">4. Patient Verification</h4>
                  <p className="text-sm mb-3 text-white">Anyone can verify without a wallet, app download, or account. Just scan the QR code.</p>
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="flex-1 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded text-center">
                      <div className="text-emerald-400 font-bold mb-1">✅ AUTHENTIC</div>
                      <div className="text-xs">Every handoff verified via ZK</div>
                    </div>
                    <div className="flex-1 bg-rose-500/10 border border-rose-500/30 p-3 rounded text-center">
                      <div className="text-rose-400 font-bold mb-1">❌ CANNOT VERIFY</div>
                      <div className="text-xs">Broken chain or unknown batch</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Comparison */}
            <section className="pb-8">
              <h3 className="text-xl font-bold text-emerald-400 mb-6">Why This Is Different</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-800 text-white">
                    <tr>
                      <th className="px-6 py-3 rounded-tl-lg w-1/2">Old System</th>
                      <th className="px-6 py-3 rounded-tr-lg w-1/2 bg-emerald-900/40 text-emerald-400">ZKDrugChain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700 border border-slate-700">
                    <tr className="bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 text-slate-400">Trust the company's database</td>
                      <td className="px-6 py-4 font-medium text-emerald-300">Trust the math</td>
                    </tr>
                    <tr className="bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 text-slate-400">QR codes can be cloned</td>
                      <td className="px-6 py-4 font-medium text-emerald-300">ZK proof cannot be faked</td>
                    </tr>
                    <tr className="bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 text-slate-400">Supply chain data is public</td>
                      <td className="px-6 py-4 font-medium text-emerald-300">Trade secrets stay private</td>
                    </tr>
                    <tr className="bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 text-slate-400">Patient can't verify anything</td>
                      <td className="px-6 py-4 font-medium text-emerald-300">Patient verifies in 2 seconds</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
          </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
