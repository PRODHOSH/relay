import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FileCode2, Plus } from "lucide-react";
import { createTemplate } from "./actions";

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  const templates = await prisma.template.findMany({
    where: { userId: user!.id },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div id="templates-header" className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Templates</h1>
          <p className="text-[#8888a8]">Manage your HTML/Markdown email templates.</p>
        </div>
        <form action={createTemplate} className="flex gap-4 items-center bg-[#111118] p-2 border border-white/10 shadow-[4px_4px_0px_rgba(255,255,255,0.05)] rounded-none">
          <input 
            type="text" 
            name="name" 
            placeholder="Template Name..." 
            required
            className="bg-[#0a0a0f] border border-white/20 px-4 py-2 text-white focus:outline-none focus:border-[#b04090] transition-colors rounded-none w-48"
          />
          <button type="submit" className="bg-white text-black px-4 py-2 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2 border border-black shadow-[2px_2px_0px_rgba(176,48,136,0.8)] rounded-none">
            <Plus size={18} /> New
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <Link 
            key={tpl.id} 
            href={`/dashboard/templates/${tpl.id}`}
            className="bg-[#111118] border border-white/10 p-6 shadow-[6px_6px_0px_rgba(0,0,0,0.5)] hover:shadow-[8px_8px_0px_rgba(176,48,136,0.5)] hover:-translate-y-1 transition-all flex flex-col items-start gap-4 rounded-none group"
          >
            <div className="w-12 h-12 bg-[#b04090]/20 border border-[#b04090]/50 flex items-center justify-center rounded-none group-hover:bg-[#b04090] transition-colors">
              <FileCode2 className="text-[#c8a0e0] group-hover:text-white transition-colors" />
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight truncate w-full">{tpl.name}</h2>
              <p className="text-[#8888a8] text-sm mt-1">Updated {new Date(tpl.updatedAt).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
        {templates.length === 0 && (
          <div className="col-span-3 text-center py-20 border border-white/10 border-dashed bg-[#111118] text-[#8888a8]">
            No templates found. Create your first one above!
          </div>
        )}
      </div>
    </div>
  );
}
