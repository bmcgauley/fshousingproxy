import { db } from '../utils/firebase.js';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import setCorsHeaders from '../utils/cors-helper.js';

/**
 * Serverless Function to fetch the latest feed from Firestore.
 */
export default async function handler(req, res) {
  // Handle CORS
  if (setCorsHeaders(req, res)) return;
  
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    console.log('Fetching latest feed from Firestore...');
    const feedsCol = collection(db, 'feeds');
    const q = query(feedsCol, orderBy('timestamp', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      res.status(200).json({ message: 'No feed data available.' });
      return;
    }

    const latestFeed = querySnapshot.docs[0].data();

    res.status(200).json({
      message: 'Feed retrieved successfully',
      data: latestFeed,
    });
  } catch (error) {
    console.error('Error fetching feed:', error.message);
    res.status(500).json({ message: `Failed to fetch feed: ${error.message}` });
  }
}