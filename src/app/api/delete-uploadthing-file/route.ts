import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';
import * as z from 'zod';

// Define a schema for the expected request body
const requestBodySchema = z.object({
  fileKey: z.string().optional(),
  fileKeys: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    // Validate the request body using zod
    const parsedBody = requestBodySchema.parse(await request.json());
    const { fileKey, fileKeys } = parsedBody;

    if (!fileKey && !fileKeys) {
      return NextResponse.json({ error: 'No fileKey(s) provided' }, { status: 400 });
    }

    // Ensure keysToDelete is always a string array
    const keysToDelete = fileKey ? [fileKey] : fileKeys ?? [];

    if (keysToDelete.length === 0) {
      return NextResponse.json({ error: 'No valid fileKey(s) provided' }, { status: 400 });
    }

    const utapi = new UTApi();
    await utapi.deleteFiles(keysToDelete);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting files', error);
    return NextResponse.json({ error: 'Error deleting files' }, { status: 500 });
  }
}
