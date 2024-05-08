const mongoose = require("mongoose");
const { Schema } = mongoose;

const pokemonSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  url: String,
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema, "Pokemons");

module.exports = Pokemon;
