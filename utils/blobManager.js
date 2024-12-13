const fs = require('fs');
const path = require('path');

const LATEST_BLOB_PATH = path.join(__dirname, 'latestBlob.json');

function getLatestBlob() {
  if (fs.existsSync(LATEST_BLOB_PATH)) {
    const data = fs.readFileSync(LATEST_BLOB_PATH, 'utf-8');
    return JSON.parse(data).latestBlob;
  }
  return null;
}

function setLatestBlob(blobKey) {
  const data = { latestBlob: blobKey };
  fs.writeFileSync(LATEST_BLOB_PATH, JSON.stringify(data), 'utf-8');
}

module.exports = { getLatestBlob, setLatestBlob }; 