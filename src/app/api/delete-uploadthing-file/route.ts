// /app/api/delete-uploadthing-file/route.ts
import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

export async function POST(request: Request) {
  try {
    const { fileKeys } = await request.json();

    if (!fileKeys || !Array.isArray(fileKeys)) {
      return NextResponse.json({ error: 'No fileKey(s) provided' }, { status: 400 });
    }

    const utapi = new UTApi();
    await utapi.deleteFiles(fileKeys);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting files', error);
    return NextResponse.json({ error: 'Error deleting files' }, { status: 500 });
  }
}
