import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

function isRequestBody(body: unknown): body is { fileKeys: string[] } {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  if (!('fileKeys' in body)) {
    return false;
  }

  // We can now safely assert that body has a 'fileKeys' property
  const maybeBody = body as { fileKeys: unknown };

  if (!Array.isArray(maybeBody.fileKeys)) {
    return false;
  }

  if (!maybeBody.fileKeys.every((key: unknown) => typeof key === 'string')) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isRequestBody(body)) {
      return NextResponse.json(
        { error: 'No fileKey(s) provided' },
        { status: 400 }
      );
    }

    // After the type guard, TypeScript knows that 'body' is '{ fileKeys: string[] }'
    const { fileKeys } = body;

    const utapi = new UTApi();
    await utapi.deleteFiles(fileKeys);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting files', error);
    return NextResponse.json(
      { error: 'Error deleting files' },
      { status: 500 }
    );
  }
}
