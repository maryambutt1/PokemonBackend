// models/PokemonDetails.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

// Define sub-schema for the ability object
const abilitySchema = new mongoose.Schema({
  name: String,
  url: String
});

// Define sub-schema for the ability in the abilities array
const abilityEntrySchema = new mongoose.Schema({
  ability: abilitySchema,
  is_hidden: Boolean,
  slot: Number
});

const pokemonSchema = new mongoose.Schema({
  pokemonId: { type: Schema.Types.ObjectId, ref: 'Pokemon' },
  name: {
    type: String,
    required: true,
  },
  abilities: [abilityEntrySchema],
  is_default: Boolean,
  base_experience: Number,
  order: Number,
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
