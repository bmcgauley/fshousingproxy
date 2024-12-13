import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request) {
  try {
    // Fetch the RSS feed from fscollegian.com
    console.log('Fetching feed from fscollegian.com...');
    const response = await fetch('https://fscollegian.com/feed/');

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const feedData = await response.text();

    // Store the fetched feed in Vercel Blob with a fixed filename
    const blob = await put('feed.xml', feedData, {
      access: 'public', // Makes the blob publicly accessible
    });

    console.log('Feed stored successfully:', blob);

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
