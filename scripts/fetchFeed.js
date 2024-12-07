const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const FEED_URL = 'https://fscollegian.com/feed/';
const OUTPUT_PATH = path.join(__dirname, '../build/feed.xml');

// Ensure the build/public directory exists
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

fetch(FEED_URL)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }
    return response.text();
  })
  .then(data => {
    fs.writeFileSync(OUTPUT_PATH, data, 'utf8');
    console.log('Feed fetched and saved to feed.xml');
  })
  .catch(error => {
    console.error('Error fetching feed:', error);
    process.exit(1);
  }); 