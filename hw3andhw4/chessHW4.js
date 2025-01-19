// Connect to the chessPlayers database
use chessPlayers;

// Insert sample data for chess players
db.chessPlayers.insertMany([
  { playerId: 1, name: "Magnus Carlsen", rating: 2850, ranking: 1, country: "Norway", age: 33, titles: ["World Champion", "Grandmaster"] },
  { playerId: 2, name: "Fabiano Caruana", rating: 2780, ranking: 2, country: "USA", age: 31, titles: ["Grandmaster"] },
  { playerId: 3, name: "Ding Liren", rating: 2805, ranking: 3, country: "China", age: 31, titles: ["World Champion", "Grandmaster"] },
  { playerId: 4, name: "Ian Nepomniachtchi", rating: 2770, ranking: 4, country: "Russia", age: 33, titles: ["Grandmaster"] },
  { playerId: 5, name: "Alireza Firouzja", rating: 2761, ranking: 5, country: "France", age: 20, titles: ["Grandmaster"] }
]);

// 1. Find players with a rating greater than 2800 and aged below 35.
print("Players with rating greater than 2800 and age below 35:");
printjson(db.chessPlayers.find({ rating: { $gt: 2800 }, age: { $lt: 35 } }).toArray());

// 2. Find players who hold the title "World Champion".
print("Players with the title 'World Champion':");
printjson(db.chessPlayers.find({ titles: "World Champion" }).toArray());

// 3. Retrieve players from either 'USA' or 'Norway'.
print("Players from USA or Norway:");
printjson(db.chessPlayers.find({ country: { $in: ["USA", "Norway"] } }).toArray());

// 4. Find players ranked between 1 and 3 and sort them by rating in descending order.
print("Players ranked between 1 and 3 sorted by rating:");
printjson(db.chessPlayers.find({ ranking: { $gte: 1, $lte: 3 } }).sort({ rating: -1 }).toArray());

// 5. Count the number of grandmasters.
print("Total number of grandmasters:");
print(db.chessPlayers.countDocuments({ titles: "Grandmaster" }));
