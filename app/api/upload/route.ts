import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 4MB for server upload)
    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` },
        { status: 413 }
      );
    }

    // Create unique filename with timestamp to prevent collisions
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
