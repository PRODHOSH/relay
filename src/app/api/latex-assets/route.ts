import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

const getAssetsDir = (projectId: string) => path.join(process.cwd(), 'public', 'latex-assets', projectId);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 });

    const assetsDir = getAssetsDir(projectId);
    if (!fsSync.existsSync(assetsDir)) {
      await fs.mkdir(assetsDir, { recursive: true });
    }
    const files = await fs.readdir(assetsDir);
    return NextResponse.json({ files });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    
    if (!file) return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 });

    const assetsDir = getAssetsDir(projectId);
    if (!fsSync.existsSync(assetsDir)) {
      await fs.mkdir(assetsDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(assetsDir, file.name);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ success: true, filename: file.name });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename');
    const projectId = searchParams.get('projectId');
    if (!filename || !projectId) return NextResponse.json({ error: 'Filename and projectId required' }, { status: 400 });

    const filePath = path.join(getAssetsDir(projectId), filename);
    if (fsSync.existsSync(filePath)) {
      await fs.unlink(filePath);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
