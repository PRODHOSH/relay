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

    const audiences = await prisma.audienceList.findMany({
      where: {
        userId: user.id
      },
      include: {
        _count: {
          select: { contacts: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ audiences });
  } catch (error) {
    console.error("Error fetching audiences:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
