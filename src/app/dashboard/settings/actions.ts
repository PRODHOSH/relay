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

  const host = formData.get("smtpHost") as string;
  const port = parseInt(formData.get("smtpPort") as string);
  const user = formData.get("smtpUser") as string;
  const pass = formData.get("smtpPass") as string;

  const encryptedPass = pass ? encrypt(pass) : undefined;

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      smtpHost: host || null,
      smtpPort: port || null,
      smtpUser: user || null,
      ...(encryptedPass !== undefined && { smtpPass: encryptedPass }),
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}
