import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-[#f0f0f5] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={session.user} />
        <main className="flex-1 overflow-auto p-6 bg-[#0a0a0f]">
          {children}
        </main>
      </div>
    </div>
  );
}
