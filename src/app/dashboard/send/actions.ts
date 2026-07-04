"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function queueEmails(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  if (!user) throw new Error("User not found");

  const templateId = formData.get("templateId") as string;
  const subject = formData.get("subject") as string;
  const emailsRaw = formData.get("emails") as string;

  if (!templateId || !subject || !emailsRaw) throw new Error("Missing fields");

  const template = await prisma.template.findUnique({ where: { id: templateId } });
  if (!template || template.userId !== user.id) throw new Error("Template not found");

  const emails = emailsRaw.split(/[\n,]+/).map(e => e.trim()).filter(e => e.includes("@"));
  
  if (emails.length === 0) throw new Error("No valid emails provided");

  const queueData = emails.map(email => ({
    toEmail: email,
    subject,
    content: template.content,
    userId: user.id,
    status: "pending"
  }));

  await prisma.emailQueue.createMany({
    data: queueData
  });

  redirect("/dashboard/send?success=true");
}
