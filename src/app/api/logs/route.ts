import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch both system logs and recent email queue items to form a comprehensive log
    const [systemLogs, emailLogs] = await Promise.all([
      prisma.systemLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 50
      }),
      prisma.emailQueue.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          toEmail: true,
          subject: true,
          status: true,
          createdAt: true,
          sentAt: true,
        }
      })
    ]);

    return NextResponse.json({ systemLogs, emailLogs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
