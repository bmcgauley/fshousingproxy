// cors-helper.js
export default function setCorsHeaders(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://fresnostatehousing.org', 'http://127.0.0.1:*', 'localhost:*'); // Replace with your frontend's origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return true;
    }
  
    return false;
  }