import QRScanner from "../../../components/QRScanner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ScanPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-md">
        <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 inline-flex transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Verify Medicine</h1>
        <p className="text-slate-400 text-center mb-8">Scan the drug's QR code to verify its ZK supply chain history.</p>
        <QRScanner />
      </div>
    </div>
  );
}
