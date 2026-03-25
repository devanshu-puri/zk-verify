"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function QRScanner() {
  const router = useRouter();
  const [error, setError] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader");

    scannerRef.current.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        // Stop scanning to prevent multiple redirects
        scannerRef.current?.stop().catch(console.error);

        // If it's a full URL to our app's verify page
        if (decodedText.includes("/verify/")) {
          router.push(decodedText);
        } else {
          try {
            // Or if it's some other URL containing "verify"
            const url = new URL(decodedText);
            const pathSegments = url.pathname.split("/");
            if (pathSegments.includes("verify")) {
              router.push(decodedText);
            }
          } catch {
            // Raw string might just be the batchId
            router.push(`/verify/${decodedText}`);
          }
        }
      },
      (err) => {
        // Ignored, continuous scanning fails gracefully
      }
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
