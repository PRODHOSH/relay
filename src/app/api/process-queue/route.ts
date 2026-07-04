import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import nodemailer from "nodemailer";

export async function GET(req: Request) {
  try {
    // 1. Fetch pending emails (limit 20 per tick to avoid rate limit)
    const pendingEmails = await prisma.emailQueue.findMany({
      where: { status: "pending" },
      take: 20,
      include: {
        user: true
      }
    });

    if (pendingEmails.length === 0) {
      return NextResponse.json({ message: "No pending emails" });
    }

    const results = [];

    // 2. Process each email
    for (const email of pendingEmails) {
      if (!email.user.smtpHost || !email.user.smtpUser || !email.user.smtpPass) {
        await prisma.emailQueue.update({
          where: { id: email.id },
          data: { status: "failed" }
        });
        results.push({ id: email.id, status: "failed", error: "Missing SMTP config" });
        continue;
      }

      try {
        const decryptedPass = decrypt(email.user.smtpPass);
        
        const transporter = nodemailer.createTransport({
          host: email.user.smtpHost,
          port: email.user.smtpPort || 465,
          secure: (email.user.smtpPort === 465),
          auth: {
            user: email.user.smtpUser,
            pass: decryptedPass
          }
        });

        await transporter.sendMail({
          from: email.user.smtpUser,
          to: email.toEmail,
          subject: email.subject,
          html: email.content
        });

        await prisma.emailQueue.update({
          where: { id: email.id },
          data: { status: "sent", sentAt: new Date() }
        });
        
        results.push({ id: email.id, status: "sent" });
      } catch (err: any) {
        await prisma.emailQueue.update({
          where: { id: email.id },
          data: { status: "failed" }
        });
        results.push({ id: email.id, status: "failed", error: err.message });
      }
    }

    return NextResponse.json({ processed: results.length, results });

  } catch (error: any) {
    console.error("Queue Processing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
