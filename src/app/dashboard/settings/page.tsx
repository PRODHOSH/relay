import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

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
        <p className="text-[#8888a8]">Configure your profile and sending credentials.</p>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-[#111118] border border-white/10 p-6 mb-8 shadow-[4px_4px_0px_rgba(255,255,255,0.05)] rounded-none flex items-center gap-6">
        {user?.image ? (
          <img src={user.image} alt={user.name || "User"} className="w-20 h-20 rounded-none border border-white/20 object-cover shadow-[2px_2px_0px_rgba(176,48,136,0.8)]" />
        ) : (
          <div className="w-20 h-20 bg-[#b04090] border border-white/20 flex items-center justify-center font-bold text-2xl rounded-none shadow-[2px_2px_0px_rgba(176,48,136,0.8)]">
            {user?.name?.charAt(0) || "U"}
          </div>
        )}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold uppercase tracking-widest">{user?.name}</h2>
          <p className="text-[#8888a8]">{user?.email}</p>
        </div>
      </div>

      {/* Provider Settings */}
      <div id="settings-provider-box" className="bg-[#111118] border border-white/10 p-8 shadow-[8px_8px_0px_rgba(255,255,255,0.05)] rounded-none mb-8">
        <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Engine Configuration</h2>
        <SettingsForm user={user} />
      </div>

      <div className="text-center">
        <p className="text-[#8888a8] text-sm">
          Any issues? Contact support at <a href="mailto:hello@prodhosh.me" className="text-[#b04090] hover:underline font-bold">hello@prodhosh.me</a>
        </p>
      </div>
    </div>
  );
}
