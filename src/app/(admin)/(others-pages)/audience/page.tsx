import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Audience</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your subscribers and import CSV contact lists.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Your Lists</h2>
          <AudienceLists lists={lists} />
        </div>
        
        <div className="flex flex-col gap-4">
          <CSVUploader />
        </div>
      </div>
    </div>
  );
}
