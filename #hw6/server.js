const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/chessPlayers", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ MongoDB connection error:"));
db.once("open", () => console.log("✅ Connected to MongoDB"));

// ✅ Define Chess Player Schema
const playerSchema = new mongoose.Schema({
  playerId: Number,
  name: String,
  rating: Number,
  ranking: Number,
  country: String,
  age: Number,
  titles: [String],
});

const Player = mongoose.model("Player", playerSchema);

// ✅ GET - Fetch All Players (FIXED)
app.get("/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST - Add New Player
app.post("/players", async (req, res) => {
  try {
    const newPlayer = new Player(req.body);
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ PATCH - Update Player
app.patch("/players/:playerId", async (req, res) => {
  try {
    const updatedPlayer = await Player.findOneAndUpdate(
      { playerId: req.params.playerId },
      { $set: req.body },
      { new: true }
    );
    if (!updatedPlayer) {
      return res.status(404).json({ message: "❌ Player not found" });
    }
    res.json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE - Remove Player
app.delete("/players/:playerId", async (req, res) => {
  try {
    const deletedPlayer = await Player.findOneAndDelete({
      playerId: req.params.playerId,
    });
    if (!deletedPlayer) {
      return res.status(404).json({ message: "❌ Player not found" });
    }
    res.json({ message: "✅ Player deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
