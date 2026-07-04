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
  const mode = formData.get("mode") as string;
  const scheduledForRaw = formData.get("scheduledFor") as string;
  
  if (!templateId || !subject) throw new Error("Missing fields");

  const template = await prisma.template.findUnique({ where: { id: templateId } });
  if (!template || template.userId !== user.id) throw new Error("Template not found");

  const scheduledFor = scheduledForRaw ? new Date(scheduledForRaw) : null;

  let queueData: any[] = [];

  if (mode === "raw") {
    const emailsRaw = formData.get("emails") as string;
    if (!emailsRaw) throw new Error("Missing emails");
    const emails = emailsRaw.split(/[\n,]+/).map(e => e.trim()).filter(e => e.includes("@"));
    if (emails.length === 0) throw new Error("No valid emails provided");
    
    queueData = emails.map(email => ({
      toEmail: email,
      subject,
      content: template.content,
      userId: user.id,
      status: "pending",
      scheduledFor
    }));
  } else if (mode === "list") {
    const listId = formData.get("listId") as string;
    if (!listId) throw new Error("Missing list selection");

    const contacts = await prisma.contact.findMany({
      where: { audienceListId: listId }
    });

    if (contacts.length === 0) throw new Error("List is empty");

    queueData = contacts.map(contact => {
      let personalizedContent = template.content;
      
      // Smart Personalization Tags replacement
      if (contact.firstName) personalizedContent = personalizedContent.replace(/\{\{FirstName\}\}/gi, contact.firstName);
      if (contact.lastName) personalizedContent = personalizedContent.replace(/\{\{LastName\}\}/gi, contact.lastName);
      
      if (contact.metadata) {
        try {
          const meta = JSON.parse(contact.metadata);
          for (const key of Object.keys(meta)) {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
            personalizedContent = personalizedContent.replace(regex, meta[key] || "");
          }
        } catch(e) {}
      }

      return {
        toEmail: contact.email,
        subject,
        content: personalizedContent,
        userId: user.id,
        status: "pending",
        scheduledFor
      };
    });
  }

  await prisma.emailQueue.createMany({
    data: queueData
  });

  redirect("/dashboard/send?success=true");
}
