import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== 'object' ||
      body === null ||
      !('fileKeys' in body) ||
      !Array.isArray((body as any).fileKeys)
    ) {
      return NextResponse.json({ error: 'No fileKey(s) provided' }, { status: 400 });
    }

    const { fileKeys } = body as { fileKeys: string[] };

    const utapi = new UTApi();
    await utapi.deleteFiles(fileKeys);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting files', error);
    return NextResponse.json({ error: 'Error deleting files' }, { status: 500 });
  }
}
