import { get } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Retrieve the stored feed from Vercel Blob
    const feedData = await get('feed.xml');

    if (!feedData) {
      throw new Error('Feed not found. Please run the update-feed endpoint first.');
    }

    res.setHeader('Content-Type', 'application/rss+xml');
    res.status(200).send(feedData);
  } catch (error) {
    console.error('Error retrieving feed:', error.message);
    res.status(500).json({ message: `Failed to retrieve feed: ${error.message}` });
  }
}