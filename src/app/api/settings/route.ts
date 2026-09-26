import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        image: true,
        emailProvider: true,
        smtpHost: true,
        smtpPort: true,
        smtpUser: true,
        smtpPass: true,
        resendKey: true,
        resendFrom: true,
        senderName: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Mask passwords/keys for frontend delivery
    const safeUser = {
      ...user,
      smtpPass: user.smtpPass ? "********" : "",
      resendKey: user.resendKey ? "********" : ""
    };

    return NextResponse.json({ settings: safeUser });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      name, emailProvider, smtpHost, smtpPort, smtpUser, smtpPass, 
      resendKey, resendFrom, senderName 
    } = body;

    const updateData: any = {
      name,
      emailProvider,
      smtpHost,
      smtpPort: smtpPort ? parseInt(smtpPort) : null,
      smtpUser,
      resendFrom,
      senderName
    };

    // Only update passwords if they are provided and not masked
    if (smtpPass && smtpPass !== "********") updateData.smtpPass = smtpPass;
    if (resendKey && resendKey !== "********") updateData.resendKey = resendKey;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
