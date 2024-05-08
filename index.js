const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("./jobs/updateDatabaseJob.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Use middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/PokemonDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

// Define routes here
app.use("/api/pokemon", require("./routes/pokemonRoutes")); // Mount the pokemonRoutes under /api/pokemon

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
