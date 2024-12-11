import { exec } from "child_process";

export default async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Use "*" for any origin, or specify "https://fresnostatehousing.org"
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Handle preflight CORS request
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  exec("npm run fetch-feed", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing fetch-feed: ${error.message}`);
      return res.status(500).json({ message: "Failed to update feed" });
    }
    console.log(`Feed updated: ${stdout}`);
    if (stderr) console.error(`stderr: ${stderr}`);
    res.status(200).json({ message: "Feed updated successfully" });
  });
};
