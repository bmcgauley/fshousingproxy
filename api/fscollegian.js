import fetch from "node-fetch";

export default async (req, res) => {
  const FEED_URL = "https://fscollegian.com/feed/";
  try {
    const response = await fetch(FEED_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const data = await response.text();
    res.setHeader("Content-Type", "application/rss+xml");
    res.status(200).send(data);
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ message: error.message });
  }
};
