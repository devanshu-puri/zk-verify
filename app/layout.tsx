import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletConnect from "../components/WalletConnect";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZKDrugChain | Medicine Authenticity",
  description: "Zero-knowledge cryptographic medicine authenticity system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-slate-100 min-h-screen flex flex-col`}>
        <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center font-bold text-slate-900">
                ZK
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                ZKDrug<span className="text-emerald-400">Chain</span>
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Dashboard</a>
              <a href="/verify/scan" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Verify Drug</a>
            </nav>
            <WalletConnect />
          </div>
        </header>
        <main className="flex-1 w-full flex flex-col items-center">
          {children}
        </main>
        <footer className="border-t border-slate-800 bg-slate-900 py-6 mt-auto w-full">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
            © 2025 ZKDrugChain • Powered by Ethereum & zkVerify
          </div>
        </footer>
      </body>
    </html>
  );
}
