"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function QRGenerator({ batchId }: { batchId: string }) {
  const [origin, setOrigin] = useState("https://blrevent.vercel.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const verifyUrl = `${origin}/verify/${batchId}`;

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-xl w-64 mx-auto">
      <QRCodeSVG value={verifyUrl} size={200} />
      <p className="mt-4 text-slate-800 text-sm font-medium text-center break-all">
        Scan to verify authenticity
      </p>
    </div>
  );
}
