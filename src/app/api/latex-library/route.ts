import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const baseDir = path.join(process.cwd(), 'generated-pdfs');
    
    if (!fs.existsSync(baseDir)) {
      return NextResponse.json({ batches: [] });
    }

    const batchFolders = fs.readdirSync(baseDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => {
        const batchPath = path.join(baseDir, d.name);
        const files = fs.readdirSync(batchPath)
          .filter(f => f.endsWith('.pdf'))
          .map(f => {
            const filePath = path.join(batchPath, f);
            const stat = fs.statSync(filePath);
            return {
              name: f,
              size: stat.size,
              createdAt: stat.birthtime.toISOString(),
              // Encode as URL-safe relative path for download
              relativePath: path.join(d.name, f).replace(/\\/g, '/'),
            };
          });
        
        const batchStat = fs.statSync(batchPath);
        return {
          batchName: d.name,
          createdAt: batchStat.birthtime.toISOString(),
          fileCount: files.length,
          files,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ batches: batchFolders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
