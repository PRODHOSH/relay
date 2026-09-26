import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { names } = await req.json();

    if (!names || !Array.isArray(names) || names.length === 0) {
      return NextResponse.json({ error: 'Please provide an array of names.' }, { status: 400 });
    }

    const texFilePath = path.join(process.cwd(), 'ambassador-offer-letter.tex');
    const outputDir = path.join(process.cwd(), 'generated-offers');

    // Ensure output directory exists
    if (!fsSync.existsSync(outputDir)) {
      await fs.mkdir(outputDir, { recursive: true });
    }

    // Read the latex template
    const latexTemplate = await fs.readFile(texFilePath, 'utf8');

    const results = [];

    // Loop through each name and call the local latex microservice
    for (const name of names) {
      if (!name.trim()) continue;

      try {
        const response = await fetch('http://localhost:5050/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latexTemplate,
            variables: { name: name.trim() },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          results.push({ name, status: 'error', error: errorData || response.statusText });
          continue;
        }

        // Get the PDF buffer
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Save to disk
        const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filePath = path.join(outputDir, `Offer_Letter_${safeName}.pdf`);
        
        await fs.writeFile(filePath, buffer);

        // Log the successful generation
        await prisma.systemLog.create({
          data: {
            action: 'OFFER_GENERATED',
            details: `Successfully generated offer for: ${name.trim()}`,
          }
        });

        results.push({ name, status: 'success', filePath });
      } catch (err: any) {
        await prisma.systemLog.create({
          data: {
            action: 'OFFER_GENERATION_FAILED',
            details: `Failed to generate offer for ${name}: ${err.message}`,
          }
        });
        results.push({ name, status: 'error', error: err.message });
      }
    }

    return NextResponse.json({
      message: `Processed ${results.length} offer letters.`,
      results,
    });

  } catch (error: any) {
    console.error('Error generating offers:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
