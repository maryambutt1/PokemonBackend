// models/PokemonDetails.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const pokemonSchema = new mongoose.Schema({
  pokemonId: { type: Schema.Types.ObjectId, ref: 'Pokemon' },
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
