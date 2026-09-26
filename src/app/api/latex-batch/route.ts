import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user?.email ? await prisma.user.findUnique({ where: { email: session.user.email } }) : null;

    const { latexTemplate, variableSets, batchName, projectId, emailConfig, passwordField } = await req.json();

    if (!latexTemplate || !variableSets || !Array.isArray(variableSets) || !projectId) {
      return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
    }

    // Create a beautifully arranged folder: e.g. D:/relay/generated-offers/Batch_Name_TIMESTAMP
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const folderName = batchName ? `${batchName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}` : `Batch_${timestamp}`;
    const outputDir = path.join(process.cwd(), 'generated-offers', folderName);

    if (!fsSync.existsSync(outputDir)) {
      await fs.mkdir(outputDir, { recursive: true });
    }

    const assetsDir = path.join(process.cwd(), 'public', 'latex-assets', projectId);
    const assets = [];
    if (fsSync.existsSync(assetsDir)) {
      const files = await fs.readdir(assetsDir);
      for (const file of files) {
        const filePath = path.join(assetsDir, file);
        const buffer = await fs.readFile(filePath);
        assets.push({
          filename: file,
          content: buffer.toString('base64')
        });
      }
    }

    const results = [];
    let emailsQueued = 0;

    // Loop through each set of variables
    for (const variables of variableSets) {
      // Find a safe filename, usually taking the first variable (like name)
      const primaryVar = Object.values(variables)[0] || 'document';
      const safeName = String(primaryVar).replace(/[^a-zA-Z0-9]/g, '_');

      try {
        const pdfPassword = passwordField && variables[passwordField] ? String(variables[passwordField]) : undefined;
        const response = await fetch('http://localhost:5050/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latexTemplate, variables, assets, password: pdfPassword }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          results.push({ variables, status: 'error', error: errorData || response.statusText });
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const filePath = path.join(outputDir, `${safeName}.pdf`);
        await fs.writeFile(filePath, buffer);

        // Queue for email if requested
        if (emailConfig && variables.email && user) {
          // Replace simple {{name}} in subject/body just in case
          let finalSubject = emailConfig.subject;
          let finalBody = emailConfig.body;
          for (const [k, v] of Object.entries(variables)) {
            finalSubject = finalSubject.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
            finalBody = finalBody.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
          }

          await prisma.emailQueue.create({
            data: {
              toEmail: variables.email,
              subject: finalSubject,
              content: finalBody,
              attachmentPath: filePath,
              userId: user.id,
              projectId: projectId
            }
          });
          emailsQueued++;
        }

        results.push({ variables, status: 'success', filePath });
      } catch (err: any) {
        results.push({ variables, status: 'error', error: err.message });
      }
    }

    if (!emailConfig) {
       await prisma.systemLog.create({
          data: {
            action: 'OFFER_GENERATED',
            details: `Successfully generated ${results.length} documents (Batch: ${folderName})`,
            userId: user?.id
          }
       });
    } else {
       await prisma.systemLog.create({
          data: {
            action: 'BATCH_EMAIL_QUEUED',
            details: `Queued ${emailsQueued} emails with PDF attachments (Batch: ${folderName})`,
            userId: user?.id
          }
       });
    }

    return NextResponse.json({
      message: `Processed ${results.length} documents.`,
      folder: outputDir,
      results,
      emailsQueued
    });
  } catch (error: any) {
    console.error('Error in batch generation:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
