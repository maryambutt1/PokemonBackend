// models/PokemonDetails.js
const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  base_experience: Number,
  height: Number,
  weight: Number,
  location_area_encounters: String,
  pokemon_id: Number,
});

const PokemonDetails = mongoose.model(
  "PokemonDetails",
  pokemonSchema,
  "PokeDetails"
);

module.exports = PokemonDetails;
