import { get } from '@vercel/blob';
import { getLatestBlob } from '../utils/blobManager';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Retrieve the latest blob key
    const latestBlobKey = getLatestBlob();

    if (!latestBlobKey) {
      throw new Error('Latest feed not found. Please run the update-feed endpoint first.');
    }

    // Retrieve the stored feed from Vercel Blob
    console.log(`Retrieving feed from Vercel Blob with key: ${latestBlobKey}`);
    const feedData = await get(latestBlobKey);

    if (!feedData) {
      throw new Error('Failed to retrieve feed data.');
    }

    res.setHeader('Content-Type', 'application/rss+xml');
    res.status(200).send(feedData);
  } catch (error) {
    console.error('Error retrieving feed:', error.message);
    res.status(500).json({ message: `Failed to retrieve feed: ${error.message}` });
  }
}