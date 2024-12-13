import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Fetch the RSS feed from fscollegian.com
    console.log('Fetching feed from fscollegian.com...');
    const response = await fetch('https://fscollegian.com/feed/');

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const feedData = await response.text();

    // Define the blob key
    const BLOB_KEY = 'feed.xml'; // Correctly formatted without slashes

    // Log the blob key
    console.log(`Storing feed with blob key: "${BLOB_KEY}"`);

    // Store the fetched feed in Vercel Blob with a fixed filename
    const blob = await put(BLOB_KEY, feedData, {
      access: 'public', // Makes the blob publicly accessible
    });

    console.log('Feed stored successfully:', blob);

    return res.status(200).json({
      message: 'Feed updated successfully',
      blobUrl: blob.url,
    });
  } catch (error) {
    console.error('Error updating feed:', error.message);
    return res.status(500).json({ message: `Failed to update feed: ${error.message}` });
  }
}
