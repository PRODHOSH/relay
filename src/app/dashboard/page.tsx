"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Check } from "lucide-react";

export default function DashboardHome() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    const onboarded = localStorage.getItem("relay_onboarded");
    if (!onboarded) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("relay_onboarded", "true");
    setShowOnboarding(false);
  };

  const nextStep = () => {
    if (tourStep === 2) {
      completeOnboarding();
    } else {
      setTourStep(prev => prev + 1);
    }
  };

  const steps = [
    {
      title: "Welcome to Relay!",
      description: "We are thrilled to have you here. Relay is the simple, powerful way to drop-in HTML email templates and queue them for sending without hitting SMTP rate limits."
    },
    {
      title: "1. Manage Templates",
      description: "Head over to the Templates tab to create and edit your raw HTML or Markdown emails using our Monaco-powered editor. You will see a live preview instantly."
    },
    {
      title: "2. Queue & Send",
      description: "When you are ready, go to Send Batch, pick a template, and paste in your recipient emails. Relay will automatically batch process them in the background via our secure queue engine."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 h-full flex flex-col">
      <div className="mb-10">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Dashboard</h1>
        <p className="text-[#8888a8]">Welcome to your Relay command center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111118] border border-white/10 p-6 flex flex-col items-start gap-4 shadow-[4px_4px_0px_rgba(255,255,255,0.05)]">
          <h2 className="text-xl font-bold uppercase tracking-tight">System Status</h2>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-green-500 block"></span>
            <span className="font-bold text-sm uppercase text-green-500">All Systems Operational</span>
          </div>
          <p className="text-[#8888a8] text-sm leading-relaxed">
            The batch processing queue is currently online. SMTP requests will be processed automatically at a rate of 20 emails per tick to prevent timeouts.
          </p>
        </div>

        <div className="bg-[#111118] border border-white/10 p-6 flex flex-col items-start gap-4 shadow-[4px_4px_0px_rgba(255,255,255,0.05)]">
          <h2 className="text-xl font-bold uppercase tracking-tight">Quick Actions</h2>
          <a href="/dashboard/templates" className="w-full text-center bg-white text-black py-3 font-bold uppercase hover:bg-gray-200 transition-colors shadow-[2px_2px_0px_rgba(176,48,136,0.8)] border border-black">
            Create Template
          </a>
          <a href="/dashboard/settings" className="w-full text-center bg-[#b04090]/20 text-[#c8a0e0] py-3 font-bold uppercase hover:bg-[#b04090]/30 transition-colors border border-[#b04090]/50 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
            Configure SMTP
          </a>
        </div>
      </div>

      {/* Onboarding Tour Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg bg-[#111118] border border-white/10 shadow-[8px_8px_0px_rgba(176,48,136,0.6)]"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                      {[0, 1, 2].map(step => (
                        <div key={step} className={`h-2 w-12 border ${tourStep >= step ? 'bg-white border-white' : 'border-white/20 bg-transparent'}`} />
                      ))}
                    </div>
                    <button onClick={completeOnboarding} className="text-[#8888a8] hover:text-white">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">{steps[tourStep].title}</h2>
                  <p className="text-[#8888a8] leading-relaxed mb-8 min-h-[80px]">
                    {steps[tourStep].description}
                  </p>

                  <div className="flex justify-end">
                    <button 
                      onClick={nextStep}
                      className="bg-white text-black px-6 py-3 font-bold uppercase flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-[2px_2px_0px_rgba(176,48,136,0.8)] border border-black"
                    >
                      {tourStep === 2 ? 'Get Started' : 'Next'}
                      {tourStep === 2 ? <Check size={18} /> : <ChevronRight size={18} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
