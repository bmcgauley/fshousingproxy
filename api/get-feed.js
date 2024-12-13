import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Retrieve the stored feed from Vercel Blob
    console.log('Retrieving feed from Vercel Blob...');
    const feedData = await get('feed.xml');

    if (!feedData) {
      throw new Error('Feed not found. Please run the update-feed endpoint first.');
    }

    console.log('Feed retrieved successfully.');

    return new NextResponse(feedData, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml',
      },
    });
  } catch (error) {
    console.error('Error retrieving feed:', error.message);
    return NextResponse.json(
      { message: `Failed to retrieve feed: ${error.message}` },
      { status: 500 }
    );
  }
}