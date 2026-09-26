const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');

// Need to load .env.local because worker runs in root
require('dotenv').config({ path: '.env.local' });

let connectionString = process.env.DATABASE_URL;
if (connectionString.includes('sslmode=require') && !connectionString.includes('uselibpqcompat')) {
  connectionString = connectionString.replace('sslmode=require', 'sslmode=require&uselibpqcompat=true');
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const POLL_INTERVAL = 30 * 1000; // 30 seconds
const BATCH_SIZE = 20;

async function processQueue() {
  console.log(`[Worker] Checking queue at ${new Date().toISOString()}`);

  try {
    // Find pending emails
    const emails = await prisma.emailQueue.findMany({
      where: {
        status: 'pending',
        OR: [
          { scheduledFor: null },
          { scheduledFor: { lte: new Date() } }
        ]
      },
      take: BATCH_SIZE,
      include: {
        user: true, // Need user details for SMTP config
      }
    });

    if (emails.length === 0) {
      return 0; // Nothing to process
    }

    console.log(`[Worker] Found ${emails.length} pending emails. Processing...`);

    for (const email of emails) {
      try {
        const user = email.user;
        let success = false;
        let errorMsg = null;
        
        let attachments = [];
        if (email.attachmentPath) {
          const fs = require('fs');
          const path = require('path');
          const paths = email.attachmentPath.split(',');
          for (const p of paths) {
            const cleanPath = p.trim();
            if (fs.existsSync(cleanPath)) {
              const buffer = fs.readFileSync(cleanPath);
              attachments.push({
                filename: path.basename(cleanPath),
                content: buffer,
                path: cleanPath
              });
            }
          }
        }

        if (user.emailProvider === 'resend' && user.resendKey) {
          const resend = new Resend(user.resendKey);
          
          const payload = {
            from: `${user.senderName || 'Relay'} <${user.resendFrom || 'noreply@yourdomain.com'}>`,
            to: email.toEmail,
            subject: email.subject,
            html: email.content,
          };
          if (attachments.length > 0) payload.attachments = attachments.map(a => ({ filename: a.filename, content: a.content }));
          
          const { data, error } = await resend.emails.send(payload);

          if (error) {
            errorMsg = error.message;
          } else {
            success = true;
          }
        } else if (user.emailProvider === 'smtp' && user.smtpHost) {
          const transporter = nodemailer.createTransport({
            host: user.smtpHost,
            port: user.smtpPort || 587,
            secure: user.smtpPort === 465,
            auth: {
              user: user.smtpUser,
              pass: user.smtpPass,
            },
          });

          const mailOptions = {
            from: `"${user.senderName || 'Relay'}" <${user.smtpUser}>`,
            to: email.toEmail,
            subject: email.subject,
            html: email.content,
          };
          if (attachments.length > 0) mailOptions.attachments = attachments.map(a => ({ filename: a.filename, path: a.path }));

          await transporter.sendMail(mailOptions);
          
          success = true;
        } else {
          errorMsg = "No valid email provider configured for user.";
        }

        if (success) {
          await prisma.emailQueue.update({
            where: { id: email.id },
            data: { status: 'sent', sentAt: new Date() }
          });
          
          await prisma.systemLog.create({
            data: {
              userId: user.id,
              action: 'EMAIL_SENT',
              details: JSON.stringify({ emailId: email.id, to: email.toEmail, subject: email.subject })
            }
          });
          console.log(`[Worker] Sent email to ${email.toEmail}`);
        } else {
          throw new Error(errorMsg || "Unknown sending error");
        }

      } catch (err) {
        console.error(`[Worker] Failed to send email to ${email.toEmail}:`, err.message);
        
        await prisma.emailQueue.update({
          where: { id: email.id },
          data: { status: 'failed' }
        });

        await prisma.systemLog.create({
          data: {
            userId: email.userId,
            action: 'EMAIL_FAILED',
            details: JSON.stringify({ emailId: email.id, to: email.toEmail, error: err.message })
          }
        });
      }
    }
    
    return emails.length;
  } catch (error) {
    console.error(`[Worker] Fatal error checking queue:`, error);
    return 0;
  }
}

async function start() {
  const isOnce = process.argv.includes('--once');

  if (isOnce) {
    console.log('[Worker] Running in local --once mode. Will exit when the queue is completely empty.');
    while (true) {
      const processedCount = await processQueue();
      if (processedCount === 0) {
        console.log('[Worker] Queue is empty. Exiting safely.');
        process.exit(0);
      }
      // Brief pause between batches
      await new Promise(res => setTimeout(res, 1000));
    }
  } else {
    // Start polling
    console.log('[Worker] Started Relay Background Worker in continuous polling mode...');
    setInterval(processQueue, POLL_INTERVAL);
    processQueue(); // Run immediately on start
  }
}

start();
