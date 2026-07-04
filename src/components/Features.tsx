"use client";

import { motion } from 'framer-motion';
import { Mail, CheckCircle2, Server } from 'lucide-react';

export default function Features() {
  return (
    <section className="w-full py-32 px-5 sm:px-8 flex flex-col items-center gap-32">
      
      {/* Feature 1: Left Mockup, Right Content */}
      <div className="max-w-[1280px] w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2"
        >
          {/* Mockup Frame */}
          <div className="relative rounded-none border border-white/[0.08] bg-[#111118] overflow-hidden shadow-[8px_8px_0px_rgba(176,48,136,0.4)]">
            <div className="h-10 border-b border-white/[0.08] flex items-center px-4 gap-2 bg-[#0a0a0f]/50">
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-none bg-[#b04090]/20 flex items-center justify-center">
                  <Mail className="text-[#b04090]" />
                </div>
                <div>
                  <div className="h-4 w-32 bg-white/10 rounded-none mb-2"></div>
                  <div className="h-3 w-48 bg-white/5 rounded-none"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-white/10 rounded-none"></div>
                <div className="h-2 w-[90%] bg-white/10 rounded-none"></div>
                <div className="h-2 w-[80%] bg-white/10 rounded-none"></div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#b04090]/10 to-transparent pointer-events-none"></div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2 flex flex-col items-start"
        >
          <div className="px-4 py-1.5 rounded-none border border-[#b04090]/30 bg-[#b04090]/10 text-[#c8a0e0] text-sm font-bold uppercase mb-6">
            Template Manager
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Drop-in your HTML. We handle the rest.</h2>
          <p className="text-[#8888a8] text-lg leading-relaxed mb-8">
            Write your email templates in raw HTML or Markdown using our Monaco-powered editor. Preview exactly what your users will see side-by-side, in real time.
          </p>
          <ul className="space-y-4">
            {['Syntax highlighting', 'Live side-by-side preview', 'Version history (Coming soon)'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/80">
                <CheckCircle2 className="text-[#c8a0e0]" size={20} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Feature 2: Left Content, Right Mockup */}
      <div className="max-w-[1280px] w-full flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2 flex flex-col items-start"
        >
          <div className="px-4 py-1.5 rounded-none border border-white/20 bg-white/5 text-white text-sm font-bold uppercase mb-6 shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
            Smart Queue
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Never hit an SMTP rate limit again.</h2>
          <p className="text-[#8888a8] text-lg leading-relaxed mb-8">
            Relay automatically batches your sends. Whether you are using the Resend API or your own custom SMTP servers, our engine perfectly spaces out your emails.
          </p>
          <ul className="space-y-4">
            {['Automated batching engine', 'BYO-SMTP credentials', 'Zero timeout errors'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/80">
                <CheckCircle2 className="text-[#c8a0e0]" size={20} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2"
        >
          {/* Mockup Frame */}
          <div className="relative rounded-none border border-white/[0.08] bg-[#111118] overflow-hidden shadow-[8px_8px_0px_rgba(255,255,255,0.1)]">
            <div className="h-10 border-b border-white/[0.08] flex items-center px-4 gap-2 bg-[#0a0a0f]/50">
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-none border border-white/10 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <Server className="text-white/40" size={18} />
                      <div className="h-3 w-24 bg-white/20 rounded-none"></div>
                    </div>
                    <div className="px-2 py-1 rounded-none text-xs bg-green-500/20 text-green-400 font-bold uppercase border border-green-500/50">Sent</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-bl from-white/[0.02] to-transparent pointer-events-none"></div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
