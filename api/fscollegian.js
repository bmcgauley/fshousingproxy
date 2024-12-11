import request from "request";

export default (req, res) => {
  request({ url: "https://fscollegian.com/feed/" }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ type: "error", message: error.message });
    }
    res.setHeader("Content-Type", "application/rss+xml");
    res.send(body);
  });
};
