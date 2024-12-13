import { put } from '@vercel/blob';
import fetch from 'node-fetch';
import { setLatestBlob } from '../utils/blobManager';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    console.log('Fetching feed from fscollegian.com...');
    const response = await fetch('https://fscollegian.com/feed/');

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const feedData = await response.text();
    const BLOB_KEY = 'feed.xml'; // Fixed blob key

    console.log(`Storing feed with blob key: "${BLOB_KEY}"`);
    const blob = await put(BLOB_KEY, feedData, {
      access: 'public', // Makes the blob publicly accessible
    });

    console.log('Feed stored successfully:', blob.url);

    // Store the latest blob key
    setLatestBlob(blob.key);

    return res.status(200).json({
      message: 'Feed updated successfully',
      blobUrl: blob.url,
    });
  } catch (error) {
    console.error('Error updating feed:', error.message);
    return res.status(500).json({ message: `Failed to update feed: ${error.message}` });
  }
}