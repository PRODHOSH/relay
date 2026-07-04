import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CSVUploader from "./CSVUploader";
import AudienceLists from "./AudienceLists";

export default async function AudiencePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });
  if (!user) redirect("/");

  const lists = await prisma.audienceList.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { contacts: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex flex-col gap-10 max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Audience</h1>
        <p className="text-[#8888a8] text-lg">Manage your subscribers and import CSV contact lists.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold uppercase tracking-tight">Your Lists</h2>
          <AudienceLists lists={lists} />
        </div>
        
        <div className="flex flex-col gap-6">
          <CSVUploader />
        </div>
      </div>
    </div>
  );
}
