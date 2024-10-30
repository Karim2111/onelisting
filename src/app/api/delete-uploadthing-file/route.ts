// /app/api/delete-uploadthing-file/route.ts
import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

export async function POST(request: Request) {
  try {
    const { fileKey, fileKeys } = await request.json();

    if (!fileKey && !fileKeys) {
      return NextResponse.json({ error: 'No fileKey(s) provided' }, { status: 400 });
    }

    const keysToDelete = fileKey ? [fileKey] : fileKeys;

    // Create an instance of UTApi
    const utapi = new UTApi();

    // Call deleteFiles on the instance
    await utapi.deleteFiles(keysToDelete);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting files', error);
    return NextResponse.json({ error: 'Error deleting files' }, { status: 500 });
  }
}
