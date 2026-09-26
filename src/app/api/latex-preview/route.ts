import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { latexTemplate, variables, projectId } = await req.json();

    if (!latexTemplate) {
      return NextResponse.json({ error: 'LaTeX template is required.' }, { status: 400 });
    }
    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required.' }, { status: 400 });
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

    const response = await fetch('http://localhost:5050/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latexTemplate,
        variables: variables || {},
        assets
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json({ error: errorData || response.statusText }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    
    // Return the PDF directly
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="preview.pdf"',
      },
    });
  } catch (error: any) {
    console.error('Error generating preview:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
