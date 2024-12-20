import { db } from '../utils/firebase.js';
import { convertXmlToJson } from '../utils/xmlConverter.js';
import { collection, addDoc, getDocs, writeBatch } from 'firebase/firestore';
import setCorsHeaders from '../utils/cors-helper.js';

/**
 * Serverless Function to upload the latest feed to Firestore.
 */
export default async function handler(req, res) {
  // Handle CORS
  if (setCorsHeaders(req, res)) return;

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    console.log('Fetching feed from https://fscollegian.com/feed/...');

    const response = await fetch('https://fscollegian.com/feed/');

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const feedData = await response.text();
    const feedJson = await convertXmlToJson(feedData);
    const FEEDS_COLLECTION = 'feeds';

    console.log('Storing feed in Firestore...');
    const feedsCol = collection(db, FEEDS_COLLECTION);
    const docRef = await addDoc(feedsCol, {
      content: feedJson,
      timestamp: new Date()
    });

    console.log('Feed stored successfully in Firestore:', docRef.id);

    // Delete all other feed documents except the newly added one
    const allFeedsSnapshot = await getDocs(feedsCol);
    const batch = writeBatch(db);
    allFeedsSnapshot.forEach(doc => {
      if (doc.id !== docRef.id) {
        batch.delete(doc.ref);
      }
    });

    await batch.commit();
    console.log('Old feeds deleted, only the latest feed is retained.');

    res.status(200).json({
      message: 'Feed updated successfully',
      docId: docRef.id,
    });
  } catch (error) {
    console.error('Error updating feed:', error.message);
    res.status(500).json({ message: `Failed to update feed: ${error.message}` });
  }
}