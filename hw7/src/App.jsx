import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [verse, setVerse] = useState(null);
  const [passage, setPassage] = useState("");

  const fetchRandomVerse = async () => {
    try {
      const response = await axios.get("/api/random");
      if (response.data) {
        setVerse(response.data);
      } else {
        console.error("No verse data received");
      }
    } catch (error) {
      console.error("Error fetching random verse:", error);
    }
  };

  const fetchSpecificVerse = async () => {
    if (!passage) return;
    try {
      const response = await axios.get(`/api/verse?passage=${encodeURIComponent(passage)}`);
      if (response.data) {
        setVerse(response.data);
      } else {
        console.error("No verse data received");
      }
    } catch (error) {
      console.error("Error fetching specific verse:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>📖 Bible Verse App</h1>
      <p>Find wisdom and inspiration from the Holy Scriptures</p>

      <button className="fetch-button" onClick={fetchRandomVerse}>
        Get Random Verse
      </button>

      <div className="input-container">
        <input
          type="text"
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
          placeholder="Enter verse (e.g., John 3:16)"
        />
        <button className="fetch-button" onClick={fetchSpecificVerse}>
          Get Specific Verse
        </button>
      </div>

      {verse && (
        <div className="verse-card">
          <h2>
            {verse.bookname} {verse.chapter}:{verse.verse}
          </h2>
          <p>"{verse.text}"</p>
        </div>
      )}
    </div>
  );
}

export default App;
