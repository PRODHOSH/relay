import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const emailId = searchParams.get('e');
  const url = searchParams.get('url');

  if (emailId) {
    try {
      await prisma.emailQueue.update({
        where: { id: emailId },
        data: { clickedAt: new Date(), openedAt: new Date() } // Also counts as an open
      });
    } catch (e) {
      // Ignore if not found
    }
  }

  if (url) {
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(new URL('/', req.url));
}
