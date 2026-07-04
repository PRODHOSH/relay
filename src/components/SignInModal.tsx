"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function SignInModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#111118] rounded-none overflow-hidden border border-white/[0.08]"
            style={{ boxShadow: '8px 8px 0px rgba(176,48,136,0.8)' }}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#f0f0f5] uppercase tracking-tight" style={{ letterSpacing: '-0.02em' }}>Welcome Back</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-none transition-colors text-white/70 hover:text-white border border-transparent hover:border-white/20">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                  className="flex items-center justify-center gap-3 w-full bg-[#f0f0f5] text-[#0a0a0f] py-4 rounded-none font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  Continue with GitHub
                </button>
                <button
                  onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                  className="flex items-center justify-center gap-3 w-full bg-transparent text-[#f0f0f5] border border-white/20 py-4 rounded-none font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
                >
                  <Mail size={20} />
                  Continue with Google
                </button>
              </div>
              <p className="text-center text-sm text-[#8888a8] mt-8 font-medium">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
