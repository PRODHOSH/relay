import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { saveSmtpSettings } from "./actions";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Settings</h1>
        <p className="text-[#8888a8]">Configure your SMTP credentials and profile.</p>
      </div>

      <div className="bg-[#111118] border border-white/10 p-8 shadow-[8px_8px_0px_rgba(255,255,255,0.05)]">
        <h2 className="text-xl font-bold uppercase tracking-tight mb-6">SMTP Configuration (Google / Custom)</h2>
        <form action={saveSmtpSettings} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">SMTP Host</label>
              <input 
                type="text" 
                name="smtpHost" 
                defaultValue={user?.smtpHost || "smtp.gmail.com"} 
                placeholder="smtp.gmail.com"
                className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">SMTP Port</label>
              <input 
                type="number" 
                name="smtpPort" 
                defaultValue={user?.smtpPort || 465} 
                placeholder="465"
                className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">SMTP Username (Email)</label>
              <input 
                type="text" 
                name="smtpUser" 
                defaultValue={user?.smtpUser || ""} 
                placeholder="you@gmail.com"
                className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-[#8888a8]">App Password</label>
              <input 
                type="password" 
                name="smtpPass" 
                placeholder={user?.smtpPass ? "•••••••• (Encrypted)" : "16-digit App Password"}
                className="bg-[#0a0a0f] border border-white/20 p-3 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none"
              />
              <span className="text-xs text-[#8888a8]">Passwords are encrypted before saving to the database.</span>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-white text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_rgba(176,48,136,0.8)] border border-black rounded-none">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
