// require('dotenv').config(); 
import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import { put } from '@vercel/blob';

const FEED_URL = 'https://fscollegian.com/feed/';
const BLOB_KEY = 'feed.xml';

(async () => {
  try {
    console.log(`Fetching feed from ${FEED_URL}...`);
    const response = await fetch(FEED_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const feedData = await response.text();

    console.log('Storing feed in Vercel Blob...');
    const blob = await put(BLOB_KEY, feedData, {
      access: 'public',
    });

    console.log('Feed stored successfully:', blob.url);
  } catch (error) {
    console.error('Error fetching or storing feed:', error.message);
    process.exit(1);
  }
})();