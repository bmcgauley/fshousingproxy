import fetch from "node-fetch";
import fs from "fs";
import path from "path";

export default async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS" || req.method === "GET") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const FEED_URL = "https://fscollegian.com/feed/";
  const OUTPUT_PATH = path.join("/tmp", "feed.xml"); // Use temporary directory


  try {
    console.log("Fetching feed from:", FEED_URL);
    const response = await fetch(FEED_URL);
    if (!response.ok) {
      console.error(`Failed to fetch feed: ${response.statusText}`);
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const data = await response.text();
    console.log("Feed fetched successfully. Writing to:", OUTPUT_PATH);

    // Check if the directory exists before writing
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      console.log("Directory does not exist, creating:", dir);
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, data, "utf8");
    console.log("Feed written successfully.");
    console.log("Feed data:", data);

    res.status(200).json({ message: "Feed updated successfully" });
  } catch (error) {
    console.error("Error updating feed:", error.message, error.stack);
    res.status(500).json({ message: "Failed to update feed: " + error.message });
  }
};
