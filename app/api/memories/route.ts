import { put, list, del } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const DATA_KEY = 'memories-data.json';

// GET - Load all memories
export async function GET() {
    try {
        const { blobs } = await list({ prefix: DATA_KEY });

        if (blobs.length === 0) {
            return NextResponse.json({ memories: [], activities: [] });
        }

        const response = await fetch(blobs[0].url);
        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error loading data:', error);
        return NextResponse.json({ memories: [], activities: [] });
    }
}

// POST - Save all memories
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Delete old version first
        const { blobs } = await list({ prefix: DATA_KEY });
        for (const blob of blobs) {
            await del(blob.url);
        }

        // Save new version
        await put(DATA_KEY, JSON.stringify(data), {
            access: 'public',
            contentType: 'application/json',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json(
            { error: 'Failed to save data' },
            { status: 500 }
        );
    }
}