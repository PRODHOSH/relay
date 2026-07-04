"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";
import { revalidatePath } from "next/cache";

export async function saveSmtpSettings(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const emailProvider = formData.get('emailProvider') as string;
  const smtpHost = formData.get('smtpHost') as string;
  const smtpPort = formData.get('smtpPort') ? parseInt(formData.get('smtpPort') as string) : null;
  const smtpUser = formData.get('smtpUser') as string;
  const smtpPass = formData.get('smtpPass') as string;
  const resendKey = formData.get('resendKey') as string;
  const resendFrom = formData.get('resendFrom') as string;

  const updateData: any = {
    emailProvider,
    smtpHost: smtpHost || null,
    smtpPort: smtpPort || null,
    smtpUser: smtpUser || null,
    resendFrom: resendFrom || null,
  };

  if (smtpPass) updateData.smtpPass = encrypt(smtpPass);
  if (resendKey) updateData.resendKey = encrypt(resendKey);

  await prisma.user.update({
    where: { email: session.user.email },
    data: updateData,
  });

  revalidatePath("/dashboard/settings");
}
