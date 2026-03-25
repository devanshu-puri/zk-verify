import CustodyTransferForm from "../../../components/CustodyTransferForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CustodyTransferPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <Link href="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 inline-flex transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <div className="flex justify-center">
        <CustodyTransferForm />
      </div>
    </div>
  );
}
