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

const criesSchema = new mongoose.Schema({
  latest: String,
  legacy: String
});

const formSchema = new mongoose.Schema({
  name: String,
  url: String
});

// Define sub-schema for the version object
const versionSchema = new mongoose.Schema({
  name: String,
  url: String
});

// Define sub-schema for the game_indices array
const gameIndexSchema = new mongoose.Schema({
  game_index: Number,
  version: versionSchema
});
// Define sub-schema for the move object
const moveSchema = new mongoose.Schema({
  name: String,
  url: String
});

// Define sub-schema for the version group details
const versionGroupDetailsSchema = new mongoose.Schema({
  level_learned_at: Number,
  move_learn_method: {
    name: String,
    url: String
  },
  version_group: {
    name: String,
    url: String
  }
});
// Define sub-schema for the species object
const speciesSchema = new mongoose.Schema({
  name: String,
  url: String
});

const pokemonSchema = new mongoose.Schema({
  pokemonId: { type: Schema.Types.ObjectId, ref: 'Pokemon' },
  name: {
    type: String,
    required: true,
  },
  abilities: [abilityEntrySchema],
  cries: criesSchema,
  forms: [formSchema], // Add forms field
  game_indices: [gameIndexSchema],
  is_default: Boolean,
  base_experience: Number,
  species: speciesSchema, // Add species field
  order: Number,
  height: Number,
  weight: Number,
  location_area_encounters: String,
});

const PokemonDetails = mongoose.model(
  "PokemonDetails",
  pokemonSchema,
  "PokeDetails"
);

module.exports = PokemonDetails;
