import { put, list, get } from '@vercel/blob';
import fetch from 'node-fetch';
import { NextResponse } from 'next/server';

/**
 * Handler to upload the latest feed.xml to Vercel Blob.
 * Generates a unique URL with a hash suffix.
 */
export async function POST(request) {
  try {
    console.log('Fetching feed from https://fscollegian.com/feed/...');
    const response = await fetch('https://fscollegian.com/feed/');

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const feedData = await response.text();
    const BLOB_KEY = 'feed.xml'; // Fixed blob key

    console.log(`Storing feed in Vercel Blob with key: "${BLOB_KEY}"`);
    const blob = await put(BLOB_KEY, feedData, {
      access: 'public', // Makes the blob publicly accessible
    });

    console.log('Feed stored successfully:', blob.url);

    return NextResponse.json({
      message: 'Feed updated successfully',
      blobUrl: blob.url,
    });
  } catch (error) {
    console.error('Error updating feed:', error.message);
    return NextResponse.json(
      { message: `Failed to update feed: ${error.message}` },
      { status: 500 }
    );
  }
}