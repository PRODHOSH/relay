"use client";

import { useState } from "react";
import { saveSmtpSettings } from "./actions";

export default function SettingsForm({ user }: { user: any }) {
  const [provider, setProvider] = useState(user?.emailProvider || "smtp");

  return (
    <form action={saveSmtpSettings} className="flex flex-col gap-8">
      {/* Provider Selection */}
      <div className="flex flex-col gap-4">
        <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">Select Email Provider</label>
        <div className="flex gap-4">
          <label className={`flex-1 border p-4 cursor-pointer flex items-center justify-between rounded-none transition-all ${provider === 'smtp' ? 'border-[#b04090] bg-[#b04090]/10 shadow-[4px_4px_0px_rgba(176,48,136,0.8)]' : 'border-white/20 bg-[#0a0a0f]'}`}>
            <div className="flex items-center gap-3">
              <input type="radio" name="emailProvider" value="smtp" checked={provider === 'smtp'} onChange={() => setProvider('smtp')} className="w-5 h-5 accent-[#b04090]" />
              <span className="font-bold uppercase tracking-wide">Google App Password / Custom SMTP</span>
            </div>
          </label>
          <label className={`flex-1 border p-4 cursor-pointer flex items-center justify-between rounded-none transition-all ${provider === 'resend' ? 'border-[#b04090] bg-[#b04090]/10 shadow-[4px_4px_0px_rgba(176,48,136,0.8)]' : 'border-white/20 bg-[#0a0a0f]'}`}>
            <div className="flex items-center gap-3">
              <input type="radio" name="emailProvider" value="resend" checked={provider === 'resend'} onChange={() => setProvider('resend')} className="w-5 h-5 accent-[#b04090]" />
              <span className="font-bold uppercase tracking-wide">Resend API</span>
            </div>
          </label>
        </div>
      </div>

      {provider === "smtp" ? (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="text-lg font-bold uppercase tracking-tight border-b border-white/10 pb-2">SMTP Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">SMTP Host</label>
              <input suppressHydrationWarning type="text" name="smtpHost" defaultValue={user?.smtpHost || "smtp.gmail.com"} placeholder="smtp.gmail.com" className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">SMTP Port</label>
              <input suppressHydrationWarning type="number" name="smtpPort" defaultValue={user?.smtpPort || 465} placeholder="465" className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">SMTP Username (Email)</label>
              <input suppressHydrationWarning type="text" name="smtpUser" defaultValue={user?.smtpUser || ""} placeholder="you@gmail.com" className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">App Password</label>
              <input suppressHydrationWarning type="password" name="smtpPass" placeholder={user?.smtpPass ? "•••••••• (Encrypted)" : "16-digit App Password"} className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none" />
              <span className="text-xs text-[#8888a8]">Passwords are AES-256 encrypted before saving.</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">Sender Name</label>
              <input suppressHydrationWarning type="text" name="senderName" defaultValue={user?.senderName || ""} placeholder="e.g. Acme Corp" className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none" />
              <span className="text-xs text-[#8888a8]">The name people see in their inbox.</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="text-lg font-bold uppercase tracking-tight border-b border-white/10 pb-2">Resend API Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">Resend API Key</label>
              <input suppressHydrationWarning type="password" name="resendKey" placeholder={user?.resendKey ? "•••••••• (Encrypted)" : "re_..."} className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none" />
              <span className="text-xs text-[#8888a8]">Your API key is AES-256 encrypted before saving to the database.</span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">From Email (Sender)</label>
              <input suppressHydrationWarning type="email" name="resendFrom" defaultValue={user?.resendFrom || ""} placeholder="updates@yourdomain.com" className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none" />
              <span className="text-xs text-[#8888a8]">The domain MUST be verified on your Resend account.</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">Sender Name</label>
              <input suppressHydrationWarning type="text" name="senderName" defaultValue={user?.senderName || ""} placeholder="e.g. Acme Corp" className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none" />
              <span className="text-xs text-[#8888a8]">The name people see in their inbox.</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button suppressHydrationWarning type="submit" className="bg-white text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_rgba(176,48,136,0.8)] hover:shadow-[6px_6px_0px_rgba(176,48,136,0.8)] hover:-translate-y-[2px] border border-black rounded-none">
          Save Settings
        </button>
      </div>
    </form>
  );
}
