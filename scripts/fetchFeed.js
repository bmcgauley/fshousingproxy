import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { db } from '../utils/firebase.js';
import { collection, addDoc, Timestamp } from "firebase/firestore";

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
    const feedJson = convertXmlToJson(feedData); // Implement this function if needed

    console.log('Storing feed in Firestore...');
    await addDoc(collection(db, FEEDS_COLLECTION), {
      content: feedJson,
      timestamp: Timestamp.fromDate(new Date())
    });

    console.log('Feed stored successfully in Firestore.');
  } catch (error) {
    console.error('Error fetching or storing feed:', error.message);
    process.exit(1);
  }
})();

// Optionally, implement XML to JSON conversion
function convertXmlToJson(xml) {
  // Implement XML parsing logic or use a library like xml2js
  return xml; // Placeholder: store XML as string if preferred
}