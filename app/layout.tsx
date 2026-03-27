import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import WalletConnect from "../components/WalletConnect";
import AboutModal from "../components/AboutModal";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const sora = Sora({ subsets: ["latin"], variable: '--font-sora' });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: "ZKDrugChain | Trust Platform",
  description: "Medical-grade cryptographic medicine authenticity system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable} ${jetbrains.variable} font-sans bg-background text-slate-100 min-h-screen flex flex-col relative overflow-x-hidden selection:bg-medical-green selection:text-black`}>
        
        {/* Global ZK Field Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#05070b,#02050a)]" />
           <div className="absolute inset-0 opacity-[0.02] animate-noise bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
           {/* Subtle medical grid */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,156,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,156,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <header className="border-b border-medical-green/10 bg-surface/50 backdrop-blur-md sticky top-0 z-50 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded bg-medical-green/10 border border-medical-green/50 flex items-center justify-center font-heading font-bold text-medical-green shadow-[0_0_15px_rgba(0,255,156,0.2)] group-hover:shadow-[0_0_25px_rgba(0,255,156,0.4)] transition-all">
                ZK
              </div>
              <h1 className="text-xl font-heading font-bold tracking-tight text-white group-hover:text-medical-green transition-colors">
                ZKDrug<span className="text-medical-green">Chain</span>
              </h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_2px_0_#00ff9c] py-1 transition-all">Home</Link>
              <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_2px_0_#00ff9c] py-1 transition-all">Live System</Link>
              <Link href="/verify/scan" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_2px_0_#00ff9c] py-1 transition-all">Verify Patient</Link>
              <AboutModal />
            </nav>
            <WalletConnect />
          </div>
        </header>
        <main className="flex-1 w-full flex flex-col items-center relative z-10">
          {children}
        </main>
        <footer className="border-t border-medical-green/10 bg-surface/80 py-6 mt-auto w-full relative z-10">
          <div className="max-w-7xl mx-auto px-4 text-center font-mono text-xs text-slate-500 uppercase tracking-widest">
            © 2025 ZKDrugChain • High-Trust Cryptographic Pipeline • Powered by zkVerify
          </div>
        </footer>
      </body>
    </html>
  );
}
