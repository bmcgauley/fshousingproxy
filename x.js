const express = require("express");
const request = require("request");
const app = express();
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.get("/fscollegian", (req, res) => {
  request({ url: "https://fscollegian.com/feed/" }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ type: "error", message: err.message });
    }
    res.set("Content-Type", "application/rss+xml");
    res.send(Buffer.from(body));
  });
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(fs.readFileSync(path.join(__dirname, "robots.txt"), "utf8"));
});

const PORT = process.env.PORT || 4050;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

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
