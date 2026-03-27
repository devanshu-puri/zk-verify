"use client";

import { useEffect, useState } from "react";
import { getReadOnlyRegistryContract } from "../../../lib/contracts";
import CustodyTimeline from "../../../components/CustodyTimeline";
import BatchCard from "../../../components/BatchCard";
import DemoVerify from "../../../components/DemoVerify";
import { DEMO_MODE, demoMedicines } from "../../../lib/demoData";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, ArrowLeft } from "lucide-react";

export default function VerifyBatchPage({ params }: { params: { batchId: string } }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  
  // Demo Mode State
  const [isDemo, setIsDemo] = useState(false);
  const [demoBatch, setDemoBatch] = useState<any>(null);

  useEffect(() => {
    // Check if DEMO_MODE intercepts
    if (DEMO_MODE) {
      const demoMatch = demoMedicines.find(m => m.id === params.batchId);
      if (demoMatch || params.batchId !== "scan") {
         setIsDemo(true);
         setDemoBatch(demoMatch || null);
         setLoading(false);
         return;
      }
    }

    const fetchVerification = async () => {
      try {
        const contract = getReadOnlyRegistryContract();
        
        const [verificationResult, batchInfo, timeline] = await Promise.all([
          contract.verifyBatchAtPharmacy(params.batchId),
          contract.batches(params.batchId),
          contract.getFullCustodyChain(params.batchId)
        ]);

        if (!batchInfo.isActive) {
          setError("Batch not found or inactive.");
          return;
        }

        setData({
          isAuthentic: verificationResult.isAuthentic,
          chainLength: Number(verificationResult.chainLength),
          batch: batchInfo,
          timeline: timeline
        });
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch chain data. Please ensure you are connected to the network.");
      } finally {
        setLoading(false);
      }
    };
    
    if (params.batchId && params.batchId !== "scan") {
      fetchVerification();
    } else {
      setLoading(false);
    }
  }, [params.batchId]);

  if (isDemo) {
      return (
        <div className="w-full max-w-3xl mx-auto py-12 px-4">
          <Link href="/demo" className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 inline-flex transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Demo
          </Link>
          <DemoVerify batch={demoBatch} onReset={() => window.location.href = '/demo'} />
        </div>
      );
  }

  if (loading) return <div className="py-20 text-center text-slate-400">Verifying cryptographic proofs...</div>;
  if (error) return <div className="py-20 text-center text-red-500 font-medium">{error}</div>;
  if (!data) return <div className="py-20 text-center text-slate-400">No data available</div>;

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4">
      <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 inline-flex transition-colors">
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>
      
      <div className="mb-8">
        {data.isAuthentic ? (
          <div className="bg-emerald-900/40 border border-emerald-500 rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-slate-900">
              <ShieldCheck className="w-10 h-10 text-slate-900" />
            </div>
            <h2 className="text-3xl font-bold text-emerald-400 mb-2">AUTHENTIC</h2>
            <p className="text-emerald-100/70 text-lg">ZK Verified Supply Chain</p>
          </div>
        ) : (
          <div className="bg-red-900/40 border border-red-500 rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-slate-900">
              <ShieldAlert className="w-10 h-10 text-slate-900" />
            </div>
            <h2 className="text-3xl font-bold text-red-400 mb-2">CANNOT VERIFY</h2>
            <p className="text-red-100/70 text-lg">Supply chain broken or incomplete</p>
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-4 mt-12">Batch Details</h3>
      <BatchCard batch={data.batch} />

      <h3 className="text-xl font-bold text-white mb-4 mt-12">Full Chain of Custody</h3>
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <CustodyTimeline records={data.timeline} />
      </div>
    </div>
  );
}
