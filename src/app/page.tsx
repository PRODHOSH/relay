import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { AlertCircle } from "lucide-react";

export default async function Home({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const isAccountLinkError = params.error === "OAuthAccountNotLinked";
  
  return (
    <div className="flex flex-col items-center p-[14px] min-h-screen relative">
      {params.error && (
        <div className="fixed top-6 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="bg-red-500/20 border-2 border-red-500 p-4 px-6 text-red-500 font-bold uppercase tracking-widest shadow-[4px_4px_0px_rgba(239,68,68,0.5)] flex items-center gap-3 backdrop-blur-sm">
            <AlertCircle size={20} />
            {isAccountLinkError 
              ? "Account already exists! Please sign in with the original provider."
              : `Login Error: ${params.error}`}
          </div>
        </div>
      )}
      <Hero />
      <Features />
      <FAQ />
      <Footer />
    </div>
  );
}
