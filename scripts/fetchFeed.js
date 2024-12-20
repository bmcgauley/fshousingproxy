import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { db } from '../utils/firebase.js';
import { convertXmlToJson } from '../utils/xmlConverter.js';
import { collection, addDoc, getDocs, writeBatch } from 'firebase/firestore';

dotenv.config();

const FEED_URL = 'https://fscollegian.com/feed/';
const FEEDS_COLLECTION = 'feeds';

(async () => {
  try {
    console.log(`Fetching feed from ${FEED_URL}...`);
    const response = await fetch(FEED_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const feedData = await response.text();
    const feedJson = await convertXmlToJson(feedData);

    console.log('Storing feed in Firestore...');
    const feedsCol = collection(db, FEEDS_COLLECTION);
    const newFeedDoc = await addDoc(feedsCol, {
      content: feedJson,
      timestamp: new Date()
    });

    console.log('Feed stored successfully in Firestore:', newFeedDoc.id);

    // Delete all other feed documents except the newly added one
    const allFeedsSnapshot = await getDocs(feedsCol);
    const batch = writeBatch(db);
    allFeedsSnapshot.forEach(doc => {
      if (doc.id !== newFeedDoc.id) {
        batch.delete(doc.ref);
      }
    });

    await batch.commit();
    console.log('Old feeds deleted, only the latest feed is retained.');
  } catch (error) {
    console.error('Error fetching or storing feed:', error.message);
    process.exit(1);
  }
})();