import { exec } from "child_process";

export default async (req, res) => {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://fresnostatehousing.org");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Respond to preflight CORS request
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  exec("npm run fetch-feed", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing fetch-feed script: ${error.message}`);
      return res.status(500).json({ message: "Failed to update feed" });
    }
    console.log(`Feed update output: ${stdout}`);
    if (stderr) {
      console.error(`Feed update stderr: ${stderr}`);
    }
    res.status(200).json({ message: "Feed updated successfully" });
  });
};
