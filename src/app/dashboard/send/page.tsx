import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import SendForm from "./SendForm";
import { redirect } from "next/navigation";

export default async function SendPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/");

  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  if (!user) redirect("/");

  const templates = await prisma.template.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" }
  });

  const lists = await prisma.audienceList.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" }
  });

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Send Batch</h1>
        <p className="text-[#8888a8]">Queue emails for background sending.</p>
      </div>
      <SendForm templates={templates} lists={lists} />
    </div>
  );
}
