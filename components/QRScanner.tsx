"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function QRScanner() {
  const router = useRouter();
  const [error, setError] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader");

    scannerRef.current.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText) => {
        if (scannedRef.current) return;
        scannedRef.current = true;

        if (scannerRef.current) {
          await scannerRef.current.stop().catch(console.error);
        }

        let batchId = decodedText;
        if (decodedText.includes("/verify/")) {
          batchId = decodedText.split("/verify/")[1];
        }
        
        router.push(`/verify/${batchId}`);
      },
      () => {}
    ).catch(err => {
      setError("Camera permission denied or not supported.");
    });

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [router]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="reader" className="w-full h-auto overflow-hidden rounded-xl border-2 border-slate-700 bg-black"></div>
      {error && <p className="text-red-500 mt-4 text-center text-sm">{error}</p>}
    </div>
  );
}
