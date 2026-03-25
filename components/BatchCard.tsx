"use client";

import { format } from "date-fns";

export default function BatchCard({ batch }: { batch: any }) {
  if (!batch) return null;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-md">
      <h3 className="text-xl font-bold text-white mb-2">{batch.drugName}</h3>
      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
        <div>
          <p className="text-slate-400">Batch Number</p>
          <p className="text-slate-200 font-medium">{batch.batchNumber}</p>
        </div>
        <div>
          <p className="text-slate-400">Status</p>
          <p className={batch.isActive ? "text-emerald-400 font-medium" : "text-red-400 font-medium"}>
            {batch.isActive ? "Active" : "Inactive"}
          </p>
        </div>
        <div>
          <p className="text-slate-400">Mfg Date</p>
          <p className="text-slate-200 font-medium">
            {format(new Date(Number(batch.manufactureDate) * 1000), "PP")}
          </p>
        </div>
        <div>
          <p className="text-slate-400">Expiry Date</p>
          <p className="text-slate-200 font-medium">
            {format(new Date(Number(batch.expiryDate) * 1000), "PP")}
          </p>
        </div>
      </div>
    </div>
  );
}
