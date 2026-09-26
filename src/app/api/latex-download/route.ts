import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }

  // Security: ensure path stays within generated-pdfs
  const baseDir = path.join(process.cwd(), 'generated-pdfs');
  const resolvedPath = path.resolve(baseDir, filePath);

  if (!resolvedPath.startsWith(baseDir)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
  }

  if (!fs.existsSync(resolvedPath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const buffer = fs.readFileSync(resolvedPath);
  const fileName = path.basename(resolvedPath);

  const isView = searchParams.get('view') === 'true';

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': isView ? `inline; filename="${fileName}"` : `attachment; filename="${fileName}"`,
    }
  });
}
