import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

type RequestBody = {
  fileKeys: unknown;
};

function isRequestBody(body: unknown): body is { fileKeys: string[] } {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  if (!('fileKeys' in body)) {
    return false;
  }

  const maybeBody = body as RequestBody;

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
    const body = await request.json();

    if (!isRequestBody(body)) {
      return NextResponse.json(
        { error: 'No fileKey(s) provided' },
        { status: 400 }
      );
    }

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
