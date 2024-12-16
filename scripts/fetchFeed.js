import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { db } from '../utils/firebaseAdmin.js';
import { convertXmlToJson } from '../utils/xmlConverter.js';

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
    await db.collection(FEEDS_COLLECTION).add({
      content: feedJson,
      timestamp: new Date()
    });

    console.log('Feed stored successfully in Firestore.');
  } catch (error) {
    console.error('Error fetching or storing feed:', error.message);
    process.exit(1);
  }
})();