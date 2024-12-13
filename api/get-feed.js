import { list, get } from '@vercel/blob';
import { NextResponse } from 'next/server';

/**
 * Handler to retrieve and serve the latest feed.xml from Vercel Blob.
 */
export async function GET(request) {
  try {
    console.log('Listing blobs with prefix "feed"');
    const blobsList = await list({ prefix: 'feed' });

    if (!blobsList.blobs || blobsList.blobs.length === 0) {
      throw new Error('No feed.xml blobs found. Please upload the feed first.');
    }

    // Sort blobs by last modified date in descending order
    const sortedBlobs = blobsList.blobs.sort(
      (a, b) => new Date(b.modified) - new Date(a.modified)
    );

    const latestBlob = sortedBlobs[0];
    console.log('Latest feed blob:', latestBlob.url);

    // Retrieve the latest feed content
    const feedContent = await get(latestBlob.key);

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