import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { getLatestBlob, setLatestBlob } from './utils/blobManager.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.static('public'));

app.get("/api/fscollegian", async (req, res) => {
  try {
    const response = await axios.get("https://fscollegian.com/feed/");
    res.set("Content-Type", "application/rss+xml");
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ type: "error", message: error.message });
  }
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(fs.readFileSync(path.join(__dirname, "robots.txt"), "utf8"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.post("/update-feed", (req, res) => {
  exec("npm run deploy", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing deploy script: ${error.message}`);
      return res.status(500).json({ message: "Failed to update feed" });
    }
    console.log(`Deploy output: ${stdout}`);
    if (stderr) {
      console.error(`Deploy stderr: ${stderr}`);
    }
    res.status(200).json({ message: "Feed updated successfully" });
  });
});
