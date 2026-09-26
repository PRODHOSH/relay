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
        user: true,
        attachmentTemplate: true
      }
    });

    if (pendingEmails.length === 0) {
      return NextResponse.json({ message: "No pending emails" });
    }

    const results = [];

    // 2. Process each email
    for (const email of pendingEmails) {
      try {
        let attachments: any[] = [];

        if (email.attachmentTemplate) {
          try {
            const contact = await prisma.contact.findFirst({
              where: { email: email.toEmail, audienceList: { userId: email.user.id } }
            });
            
            let variables: any = { email: email.toEmail };
            if (contact) {
              variables.firstName = contact.firstName || "";
              variables.lastName = contact.lastName || "";
              variables.name = `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || contact.email;
              if (contact.metadata) {
                try {
                  const meta = JSON.parse(contact.metadata);
                  variables = { ...variables, ...meta };
                } catch(e){}
              }
            }

            const response = await fetch("http://localhost:5050/generate-pdf", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                latexTemplate: email.attachmentTemplate.content,
                variables
              })
            });

            if (response.ok) {
              const arrayBuffer = await response.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              attachments.push({
                filename: `${email.attachmentTemplate.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
                content: buffer,
                contentType: 'application/pdf'
              });
            } else {
              console.error("Failed to generate PDF for", email.toEmail);
            }
          } catch (e) {
            console.error("LaTeX microservice error:", e);
          }
        }

        // Attach static files from attachmentPath
        if (email.attachmentPath) {
          try {
            const fs = require('fs');
            const path = require('path');
            const paths = email.attachmentPath.split(',');
            for (const p of paths) {
              if (fs.existsSync(p)) {
                 const buffer = fs.readFileSync(p);
                 attachments.push({
                   filename: path.basename(p),
                   content: buffer,
                   contentType: p.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'
                 });
              }
            }
          } catch(e) {
            console.error("Failed to attach static files:", e);
          }
        }

        // --- TRACKING INJECTION ---
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        let trackedContent = email.content;
        
        // 1. Rewrite Links for Click Tracking
        trackedContent = trackedContent.replace(/href="([^"]+)"/g, (match, url) => {
          // Ignore mailto, tel, etc. Only track HTTP links.
          if (url.startsWith('http')) {
            const trackedUrl = `${baseUrl}/api/track/click?e=${email.id}&url=${encodeURIComponent(url)}`;
            return `href="${trackedUrl}"`;
          }
          return match;
        });

        // 2. Add Open Tracking Pixel
        const trackingPixel = `<img src="${baseUrl}/api/track/open?e=${email.id}" width="1" height="1" alt="" style="display:none;" />`;
        if (trackedContent.includes('</body>')) {
          trackedContent = trackedContent.replace('</body>', `${trackingPixel}</body>`);
        } else {
          trackedContent += trackingPixel;
        }
        // --------------------------

        if (email.user.emailProvider === "resend") {
          if (!email.user.resendKey) throw new Error("Missing Resend API key");
          const decryptedKey = decrypt(email.user.resendKey);
          const resend = new Resend(decryptedKey);

          const fromEmail = email.user.resendFrom || email.user.email || 'onboarding@resend.dev';
          const senderName = email.user.senderName || email.user.name || 'Relay Engine';

          const { data, error } = await resend.emails.send({
            from: `${senderName} <${fromEmail}>`,
            to: email.toEmail,
            subject: email.subject,
            html: trackedContent,
            attachments: attachments.length > 0 ? attachments.map(a => ({
              filename: a.filename,
              content: a.content
            })) : undefined
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

          const senderName = email.user.senderName || email.user.name || 'Relay Engine';

          await transporter.sendMail({
            from: `"${senderName}" <${email.user.smtpUser}>`, // For Gmail SMTP, it will always force this address as the sender, but respects the name
            to: email.toEmail,
            subject: email.subject,
            html: trackedContent,
            attachments: attachments.length > 0 ? attachments : undefined
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

      // To avoid Resend's strict 2 requests-per-second free tier rate limit, 
      // wait 550ms between processing each email.
      if (email.user.emailProvider === "resend") {
        await new Promise(resolve => setTimeout(resolve, 550));
      }
    }

    return NextResponse.json({ processed: results.length, results });

  } catch (error: any) {
    console.error("Queue Processing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
