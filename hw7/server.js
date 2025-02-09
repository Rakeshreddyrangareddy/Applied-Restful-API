const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve frontend build files
app.use(express.static(path.join(__dirname, "dist")));

// Function to fetch a verse with retries
const fetchWithRetry = async (url, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1}: Fetching ${url}`);
      const start = Date.now();

      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          Accept: "application/json",
        },
        timeout: 5000,
      });

      const end = Date.now();
      console.log(`Response Time: ${(end - start) / 1000}s`);

      if (response.data) {
        return response.data; // Return the full response
      }

      console.error("API returned empty response");
    } catch (error) {
      console.error(
        `Error on attempt ${i + 1}:`,
        error.response?.status,
        error.response?.data
      );
      if (i < retries - 1) {
        await new Promise((res) => setTimeout(res, delay)); // Wait before retrying
      }
    }
  }
  return null;
};

// **Use Fast API for Random Verse**
app.get("/api/random", async (req, res) => {
  console.log("Received request for a fresh random verse...");

  const RANDOM_VERSE_API = "https://bible-api.com/?random=1";

  const response = await fetchWithRetry(RANDOM_VERSE_API);

  if (!response) {
    console.error("Failed to fetch random verse after multiple attempts.");
    return res
      .status(500)
      .json({ error: "Failed to fetch random verse after multiple attempts." });
  }

  // Format response properly
  const formattedVerse = {
    bookname: response.reference.replace(/[\d:]/g, "").trim(), // Extract book name
    chapter: response.reference.match(/\d+/g)?.[0] || "Unknown", // Extract chapter number
    verse: response.reference.match(/\d+/g)?.[1] || "Unknown", // Extract verse number
    text: response.text.trim(), // Get the verse text
  };

  console.log("Sending a fresh random verse:", formattedVerse);
  res.json(formattedVerse);
});

// **Use Fast API for Specific Verse**
app.get("/api/verse", async (req, res) => {
  const { passage } = req.query;

  if (!passage) {
    return res
      .status(400)
      .json({ error: "Passage query parameter is required" });
  }

  console.log(`Fetching specific verse: ${passage}`);

  // Use fast API instead of labs.bible.org
  const SPECIFIC_VERSE_API = `https://bible-api.com/${encodeURIComponent(
    passage
  )}`;

  const response = await fetchWithRetry(SPECIFIC_VERSE_API);

  if (!response) {
    console.error("Failed to fetch specific verse after multiple attempts.");
    return res
      .status(500)
      .json({
        error: "Failed to fetch specific verse after multiple attempts.",
      });
  }

  // Format response properly
  const formattedVerse = {
    bookname: response.reference.replace(/[\d:]/g, "").trim(), // Extract book name
    chapter: response.reference.match(/\d+/g)?.[0] || "Unknown", // Extract chapter number
    verse: response.reference.match(/\d+/g)?.[1] || "Unknown", // Extract verse number
    text: response.text.trim(), // Get the verse text
  };

  console.log("Sending specific verse:", formattedVerse);
  res.json(formattedVerse);
});

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);
