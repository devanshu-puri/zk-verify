"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QRGenerator({ batchId }: { batchId: string }) {
  // Extract base URL correctly in client components
  const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verify/${batchId}`;

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-xl w-64 mx-auto">
      <QRCodeSVG value={verifyUrl} size={200} />
      <p className="mt-4 text-slate-800 text-sm font-medium text-center break-all">
        Scan to verify authenticity
      </p>
    </div>
  );
}
