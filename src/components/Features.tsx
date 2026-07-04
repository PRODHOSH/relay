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
          <div className="relative rounded-none border border-white/[0.08] bg-[#111118] overflow-hidden shadow-[8px_8px_0px_rgba(176,48,136,0.4)] group">
            <div className="h-10 border-b border-white/[0.08] flex items-center px-4 gap-2 bg-[#0a0a0f]/50">
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
            </div>
            <div className="w-full relative h-[300px] flex">
              {/* Editor Mockup HTML/CSS */}
              <div className="w-1/2 bg-[#0a0a0f] border-r border-white/10 p-4 font-mono text-sm overflow-hidden opacity-90">
                <div className="text-[#8888a8]">{'<div className="newsletter">'}</div>
                <div className="text-[#b04090] ml-4">{'<h1>'}</div>
                <div className="text-white ml-8">{'Weekly Update'}</div>
                <div className="text-[#b04090] ml-4">{'</h1>'}</div>
                <div className="text-[#c8a0e0] ml-4">{'<p>'}</div>
                <div className="text-white/80 ml-8">{'Check out our latest news...'}</div>
                <div className="text-[#c8a0e0] ml-4">{'</p>'}</div>
                <div className="text-[#8888a8]">{'</div>'}</div>
              </div>
              <div className="w-1/2 bg-white p-6 font-sans overflow-hidden">
                <h1 className="text-2xl font-bold text-black mb-2">Weekly Update</h1>
                <p className="text-gray-700 leading-relaxed">Check out our latest news...</p>
                <div className="mt-4 w-24 h-8 bg-black text-white font-bold flex items-center justify-center text-xs uppercase">Read More</div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#b04090]/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2 flex flex-col items-start"
        >
          <div className="px-4 py-1.5 rounded-none border border-[#b04090]/30 bg-[#b04090]/10 text-[#c8a0e0] text-sm font-bold uppercase mb-6 shadow-[2px_2px_0px_rgba(176,48,136,0.5)]">
            Template Manager
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Drop-in your HTML. We handle the rest.</h2>
          <p className="text-[#8888a8] text-lg leading-relaxed mb-8">
            Write your email templates in raw HTML or Markdown using our Monaco-powered editor. Preview exactly what your users will see side-by-side, in real time.
          </p>
          <ul className="space-y-4">
            {['Syntax highlighting', 'Live side-by-side preview', 'Markdown support built-in'].map((item, i) => (
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
            {['Automated batching engine', 'Background processing', 'Zero timeout errors'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/80">
                <CheckCircle2 className="text-white/80" size={20} />
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
          <div className="relative rounded-none border border-white/[0.08] bg-[#111118] overflow-hidden shadow-[8px_8px_0px_rgba(255,255,255,0.1)] group">
            <div className="h-10 border-b border-white/[0.08] flex items-center px-4 gap-2 bg-[#0a0a0f]/50">
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
            </div>
            <div className="w-full relative h-[300px] bg-[#0a0a0f] p-6 flex flex-col gap-3 overflow-hidden">
              {/* Queue Mockup HTML/CSS */}
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-[#111118] border border-white/10 p-3 px-4 flex justify-between items-center shadow-[2px_2px_0px_rgba(255,255,255,0.05)]">
                  <div className="flex flex-col">
                    <span className="text-white/90 text-sm font-bold">Important update</span>
                    <span className="text-[#8888a8] text-xs">user{i}@example.com</span>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-bold uppercase tracking-wider">Sent</span>
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-bl from-white/[0.02] to-transparent pointer-events-none"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature 3: Left Mockup, Right Content */}
      <div className="max-w-[1280px] w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2"
        >
          {/* Mockup Frame */}
          <div className="relative rounded-none border border-white/[0.08] bg-[#111118] overflow-hidden shadow-[8px_8px_0px_rgba(176,48,136,0.4)] group">
            <div className="h-10 border-b border-white/[0.08] flex items-center px-4 gap-2 bg-[#0a0a0f]/50">
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
              <div className="w-3 h-3 rounded-none bg-white/20"></div>
            </div>
            <div className="w-full relative h-[300px] bg-[#0a0a0f] p-6 flex flex-col gap-4 overflow-hidden">
              {/* Settings Mockup HTML/CSS */}
              <div className="flex gap-4 mb-2">
                <div className="flex-1 bg-[#111118] border border-white/20 p-3 text-white/50 text-xs font-bold uppercase flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-white/50"></div> SMTP
                </div>
                <div className="flex-1 bg-[#b04090]/10 border border-[#b04090] p-3 text-white text-xs font-bold uppercase shadow-[2px_2px_0px_rgba(176,48,136,0.8)] flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#b04090]"></div> Resend API
                </div>
              </div>
              <div className="bg-[#111118] border border-white/10 p-5 flex flex-col gap-4 shadow-[4px_4px_0px_rgba(255,255,255,0.05)]">
                 <div className="flex flex-col gap-2">
                   <div className="text-[10px] text-[#8888a8] font-bold uppercase">Resend API Key</div>
                   <div className="h-8 bg-[#0a0a0f] border border-white/20 w-full flex items-center px-3 text-white/40 text-xs tracking-widest">••••••••••••••••</div>
                 </div>
                 <div className="flex flex-col gap-2">
                   <div className="text-[10px] text-[#8888a8] font-bold uppercase">From Email (Sender)</div>
                   <div className="h-8 bg-[#0a0a0f] border border-white/20 w-full flex items-center px-3 text-white text-xs">updates@yourdomain.com</div>
                 </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#b04090]/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2 flex flex-col items-start"
        >
          <div className="px-4 py-1.5 rounded-none border border-[#b04090]/30 bg-[#b04090]/10 text-[#c8a0e0] text-sm font-bold uppercase mb-6 shadow-[2px_2px_0px_rgba(176,48,136,0.5)]">
            Secure Engine
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Your credentials. Our engine.</h2>
          <p className="text-[#8888a8] text-lg leading-relaxed mb-8">
            Configure your sending engine with ease. Choose between your own Google App Passwords or a Resend API key. We secure your keys with AES-256 encryption.
          </p>
          <ul className="space-y-4">
            {['AES-256 encryption built-in', 'Supports multiple providers', 'Instant dynamic switching'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/80">
                <CheckCircle2 className="text-[#c8a0e0]" size={20} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

    </section>
  );
}
