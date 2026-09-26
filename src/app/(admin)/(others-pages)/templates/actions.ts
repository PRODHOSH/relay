"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getTemplates() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];
  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  if (!user) return [];
  
  return prisma.template.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' }
  });
}

export async function getTemplate(id: string) {
  return prisma.template.findUnique({ where: { id } });
}

export async function createTemplate(name: string, content: string, format: string = "html", variables: string[] = []) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  if (!user) throw new Error("User not found");

  // Ensure 'email' is always present and first
  const allVars = ['email', ...variables.filter(v => v.toLowerCase() !== 'email')];

  const template = await prisma.template.create({
    data: {
      name,
      content,
      format,
      userId: user.id,
      variables: JSON.stringify(allVars),
    }
  });

  return template;
}

export async function updateTemplate(id: string, content: string, name: string, format?: string, variables?: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const updateData: any = { content, name };
  if (format) updateData.format = format;
  if (variables !== undefined) {
    const allVars = ['email', ...variables.filter(v => v.toLowerCase() !== 'email')];
    updateData.variables = JSON.stringify(allVars);
  }

  return prisma.template.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteTemplate(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  return prisma.template.delete({
    where: { id }
  });
}
