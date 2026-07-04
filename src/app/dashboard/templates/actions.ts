"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createTemplate(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  if (!name) throw new Error("Name required");

  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  
  const template = await prisma.template.create({
    data: {
      name,
      content: "<h1>Hello World</h1>\n<p>This is a new template.</p>",
      userId: user!.id,
    }
  });

  redirect(`/dashboard/templates/${template.id}`);
}

export async function updateTemplate(id: string, content: string, name: string, format: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.template.update({
    where: { id },
    data: { content, name, format }
  });
}
