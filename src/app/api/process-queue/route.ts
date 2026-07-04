import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import nodemailer from "nodemailer";
import { Resend } from "resend";

export async function GET(req: Request) {
  try {
    // 1. Fetch up to 20 pending emails that are scheduled for now or earlier
    const pendingEmails = await prisma.emailQueue.findMany({
      where: { 
        status: "pending",
        OR: [
          { scheduledFor: null },
          { scheduledFor: { lte: new Date() } }
        ]
      },
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
      try {
        if (email.user.emailProvider === "resend") {
          if (!email.user.resendKey) throw new Error("Missing Resend API key");
          const decryptedKey = decrypt(email.user.resendKey);
          const resend = new Resend(decryptedKey);

          // For Resend, you MUST use a verified domain.
          const fromEmail = email.user.resendFrom || email.user.email || 'onboarding@resend.dev';

          const { data, error } = await resend.emails.send({
            from: `Relay Engine <${fromEmail}>`,
            to: email.toEmail,
            subject: email.subject,
            html: email.content
          });

          if (error) {
            throw new Error(error.message);
          }
        } else {
          // SMTP Provider
          if (!email.user.smtpHost || !email.user.smtpUser || !email.user.smtpPass) {
             throw new Error("Missing SMTP config");
          }
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
            from: email.user.smtpUser, // For Gmail SMTP, it will always force this address as the sender
            to: email.toEmail,
            subject: email.subject,
            html: email.content
          });
        }

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
