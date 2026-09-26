import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let user = session?.user?.email ? await prisma.user.findUnique({ where: { email: session.user.email } }) : null;
    if (!user) {
       user = await prisma.user.findFirst(); 
    }
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const payloadStr = formData.get("payload") as string;
    if (!payloadStr) return NextResponse.json({ error: "Missing payload" }, { status: 400 });

    const payload = JSON.parse(payloadStr);
    const { campaignName, emailSubject, senderName, senderEmail, emailCode, emailFormat, audience, attachments, savePdfsLocally, enablePassword, passwordField } = payload;

    const project = await prisma.project.create({
      data: { name: campaignName, type: "campaign", status: "Active", userId: user.id }
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.join(process.cwd(), 'generated-pdfs', `${campaignName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}`);
    
    if (savePdfsLocally && !fsSync.existsSync(outputDir)) {
      await fs.mkdir(outputDir, { recursive: true });
    }

    const tmpDir = os.tmpdir();
    let emailsQueued = 0;

    for (const row of audience) {
      if (!row.email) continue;
      
      let finalSubject = emailSubject;
      let finalBody = emailCode;
      for (const [k, v] of Object.entries(row)) {
        finalSubject = finalSubject.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), String(v));
        finalBody = finalBody.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), String(v));
      }

      let attachmentPaths: string[] = [];

      for (const att of attachments) {
        let filePath = null;
        
        if (att.type.includes('latex')) {
           const pdfPassword = enablePassword && passwordField && row[passwordField] ? String(row[passwordField]) : undefined;
           
           try {
             const response = await fetch('http://localhost:5050/generate-pdf', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ latexTemplate: att.content, variables: row, password: pdfPassword })
             });
             
             if (response.ok) {
               const buffer = Buffer.from(await response.arrayBuffer());
               const safeName = String(row.email).replace(/[^a-zA-Z0-9]/g, '_');
               const fileName = `${att.name.replace(/[^a-zA-Z0-9]/g, '_')}_${safeName}.pdf`;
               filePath = path.join(savePdfsLocally ? outputDir : tmpDir, fileName);
               await fs.writeFile(filePath, buffer);
             } else {
               console.error("LaTeX generation failed:", await response.text());
             }
           } catch (e) {
             console.error("LaTeX service error:", e);
           }
        } else if (att.type === 'upload') {
           const file = formData.get(`file_${att.id}`) as File;
           if (file) {
             const buffer = Buffer.from(await file.arrayBuffer());
             filePath = path.join(savePdfsLocally ? outputDir : tmpDir, `${uuidv4()}_${file.name}`);
             await fs.writeFile(filePath, buffer);
           }
        }

        if (filePath) {
          attachmentPaths.push(filePath); 
        }
      }

      const emailQueueRecord = await prisma.emailQueue.create({
        data: {
          toEmail: row.email,
          subject: finalSubject,
          content: finalBody,
          attachmentPath: attachmentPaths.length > 0 ? attachmentPaths.join(',') : null,
          userId: user.id,
          projectId: project.id,
          status: "pending"
        }
      });

      // Inject Tracking Pixel for HTML emails
      if (emailFormat === 'html') {
        const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/track/${emailQueueRecord.id}`;
        const trackingPixel = `<img src="${trackingUrl}" width="1" height="1" alt="" style="display:none;" />`;
        await prisma.emailQueue.update({
          where: { id: emailQueueRecord.id },
          data: { content: finalBody + trackingPixel }
        });
      }

      emailsQueued++;
    }

    await prisma.systemLog.create({
      data: {
        action: 'CAMPAIGN_LAUNCHED',
        details: `Queued ${emailsQueued} emails for campaign: ${campaignName}`,
        userId: user.id
      }
    });

    return NextResponse.json({ success: true, emailsQueued });
  } catch (error: any) {
    console.error("Launch Error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
