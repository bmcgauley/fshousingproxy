import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { POST } from './update-feed';
const url = POST.blob.url
console.log(url)
/**
 * Handler to retrieve and serve the latest feed.xml from Vercel Blob.
 */
export async function GET(request) {
  try {
    const feedContent = await get(url);

    if (!feedContent) {
      throw new Error('Failed to retrieve feed content.');
    }

    return new NextResponse(feedContent, {
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