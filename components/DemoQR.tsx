"use client";

import { QRCodeSVG } from "qrcode.react";

export default function DemoQR({ batchId }: { batchId: string }) {
  const url = `https://blrevent.vercel.app/verify/${batchId}`;

  return (
    <div className="bg-white p-4 rounded-xl inline-block">
      <QRCodeSVG
        value={url}
        size={200}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
        includeMargin={false}
      />
      <div className="mt-4 text-center text-xs text-slate-500 font-mono break-all w-[200px]">
        {batchId.slice(0, 10)}...{batchId.slice(-8)}
      </div>
    </div>
  );
}
