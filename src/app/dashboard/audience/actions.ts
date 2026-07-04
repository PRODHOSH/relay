"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createAudienceList(name: string, contacts: any[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  // Create list
  const list = await prisma.audienceList.create({
    data: {
      name,
      userId: user.id,
    },
  });

  // Prepare contacts
  const contactData = contacts.map(c => {
    const email = c.Email || c.email || c.EMAIL;
    const firstName = c.FirstName || c.firstname || c.first_name || c['First Name'] || null;
    const lastName = c.LastName || c.lastname || c.last_name || c['Last Name'] || null;
    
    // Put everything else in metadata
    const meta = { ...c };
    delete meta.Email; delete meta.email; delete meta.EMAIL;
    delete meta.FirstName; delete meta.firstname; delete meta.first_name; delete meta['First Name'];
    delete meta.LastName; delete meta.lastname; delete meta.last_name; delete meta['Last Name'];

    return {
      audienceListId: list.id,
      email: email,
      firstName,
      lastName,
      metadata: Object.keys(meta).length > 0 ? JSON.stringify(meta) : null
    };
  }).filter(c => c.email); // Only keep rows with an email address

  // Insert contacts
  if (contactData.length > 0) {
    await prisma.contact.createMany({
      data: contactData,
      skipDuplicates: true
    });
  }

  revalidatePath("/dashboard/audience");
  revalidatePath("/dashboard/send");
}

export async function deleteAudienceList(listId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  await prisma.audienceList.delete({
    where: { 
      id: listId,
      userId: user!.id 
    }
  });

  revalidatePath("/dashboard/audience");
  revalidatePath("/dashboard/send");
}
