import fetch from "node-fetch";
import fs from "fs";
import path from "path";

export default async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const FEED_URL = "https://fscollegian.com/feed/";
  const OUTPUT_PATH = path.join(process.cwd(), "public/feed.xml"); // Save in the public directory

  try {
    const response = await fetch(FEED_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const data = await response.text();
    fs.writeFileSync(OUTPUT_PATH, data, "utf8"); // Write to feed.xml
    console.log("Feed updated successfully");

    res.status(200).json({ message: "Feed updated successfully" });
  } catch (error) {
    console.error("Error updating feed:", error);
    res.status(500).json({ message: error.message });
  }
};
