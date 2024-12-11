const { exec } = require("child_process");

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
};
