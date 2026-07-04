import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileCode2, Clock, CheckCircle2, XCircle } from "lucide-react";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  if (!user) redirect("/");

  const [templateCount, pendingCount, sentCount, failedCount] = await Promise.all([
    prisma.template.count({ where: { userId: user.id } }),
    prisma.emailQueue.count({ where: { userId: user.id, status: 'pending' } }),
    prisma.emailQueue.count({ where: { userId: user.id, status: 'sent' } }),
    prisma.emailQueue.count({ where: { userId: user.id, status: 'failed' } })
  ]);

  return (
    <div id="dashboard-overview" className="max-w-4xl mx-auto py-10 h-full flex flex-col">
      <div className="flex items-center gap-5 mb-10 bg-[#111118] border border-white/10 p-6 shadow-[4px_4px_0px_rgba(255,255,255,0.05)]">
        {user.image ? (
          <img src={user.image} alt={user.name || "User"} className="w-20 h-20 rounded-none border border-white/20 shadow-[2px_2px_0px_rgba(176,48,136,0.8)] object-cover" />
        ) : (
          <div className="w-20 h-20 bg-[#b04090] border border-white/20 flex items-center justify-center font-bold text-2xl rounded-none shadow-[2px_2px_0px_rgba(176,48,136,0.8)]">
            {user.name?.charAt(0) || "U"}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Welcome back, {user.name}</h1>
          <p className="text-[#8888a8]">Here is your Relay command center overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111118] border border-white/10 p-5 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 text-[#c8a0e0] mb-3">
            <FileCode2 size={20} />
            <span className="font-bold uppercase tracking-wider text-sm">Templates</span>
          </div>
          <p className="text-4xl font-bold">{templateCount}</p>
        </div>
        <div className="bg-[#111118] border border-white/10 p-5 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 text-blue-400 mb-3">
            <Clock size={20} />
            <span className="font-bold uppercase tracking-wider text-sm">Queued</span>
          </div>
          <p className="text-4xl font-bold">{pendingCount}</p>
        </div>
        <div className="bg-[#111118] border border-white/10 p-5 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 text-green-500 mb-3">
            <CheckCircle2 size={20} />
            <span className="font-bold uppercase tracking-wider text-sm">Sent</span>
          </div>
          <p className="text-4xl font-bold">{sentCount}</p>
        </div>
        <div className="bg-[#111118] border border-white/10 p-5 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 text-red-500 mb-3">
            <XCircle size={20} />
            <span className="font-bold uppercase tracking-wider text-sm">Failed</span>
          </div>
          <p className="text-4xl font-bold">{failedCount}</p>
        </div>
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
          <Link href="/dashboard/templates" className="w-full text-center bg-white text-black py-3 font-bold uppercase hover:bg-gray-200 transition-colors shadow-[2px_2px_0px_rgba(176,48,136,0.8)] border border-black">
            Create Template
          </Link>
          <Link href="/dashboard/settings" className="w-full text-center bg-[#b04090]/20 text-[#c8a0e0] py-3 font-bold uppercase hover:bg-[#b04090]/30 transition-colors border border-[#b04090]/50 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
            Configure Engine
          </Link>
        </div>
      </div>
    </div>
  );
}
