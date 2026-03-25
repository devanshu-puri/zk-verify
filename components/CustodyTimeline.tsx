"use client";

import ProofStatusBadge from "./ProofStatusBadge";
import { format } from "date-fns";

export default function CustodyTimeline({ records }: { records: any[] }) {
  if (!records || records.length === 0) return <p className="text-gray-500">No custody records found.</p>;

  // Format array to easily map through them
  // The records come from the smart contract which returns a tuple array
  return (
    <div className="space-y-6 border-l-2 border-slate-700 ml-4 pb-4 mt-8">
      {records.map((record, idx) => {
        const chainStepString = record.chainStep.toString();
        const stepName = chainStepString === "1" ? "Distributor" : chainStepString === "2" ? "Wholesaler" : "Pharmacy";
        
        return (
          <div key={idx} className="relative pl-6">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900" />
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-200">
                  Step {chainStepString}: {stepName}
                </h4>
                <span className="text-xs text-slate-400">
                  {format(new Date(Number(record.timestamp) * 1000), "PPpp")}
                </span>
              </div>
              <div className="text-sm text-slate-400 space-y-1">
                <p><span className="text-slate-500">From:</span> {record.fromEntityHash}</p>
                <p><span className="text-slate-500">To:</span> {record.toEntityHash}</p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
                  <span className="text-slate-500">ZK Attestation:</span>
                  <ProofStatusBadge isVerified={record.zkVerified} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
