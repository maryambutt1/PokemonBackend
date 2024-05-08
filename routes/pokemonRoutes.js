const express = require("express");
const router = express.Router();
const axios = require("axios");
const PokemonDetails = require("../models/PokemonDetails");
const Pokemon = require("../models/Pokemon");

router.get("/fetch", async (req, res) => {
  try {
    console.log("Fetching Pokémon data from external API...");
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
    const pokemonData = response.data.results;

    await Pokemon.deleteMany({});

    // Clear existing data in the collection before inserting new data
    await PokemonDetails.deleteMany({});

    // Create an array to hold the Pokemon details
    const pokemonDetailsArray = [];

    // Fetch detailed data for each Pokemon
    for (const pokemon of pokemonData) {
      const pokemonDetailResponse = await axios.get(pokemon.url);
      const pokemonDetailData = pokemonDetailResponse.data;

      // Construct a new PokemonDetails object
      const newPokemonDetail = {
        name: pokemonDetailData.name,
        base_experience: pokemonDetailData.base_experience,
        height: pokemonDetailData.height,
        weight: pokemonDetailData.weight,
        location_area_encounters: pokemonDetailData.location_area_encounters,
      };

      // Add the new PokemonDetails object to the array
      pokemonDetailsArray.push(newPokemonDetail);
    }

    // Insert new data into the collection using insertMany
    await PokemonDetails.insertMany(pokemonDetailsArray);
    await Pokemon.insertMany(pokemonData);

    res.json(pokemonDetailsArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/names", async (req, res) => {
  try {
    console.log("Fetching Pokémon names from external API...");
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
    const pokemonList = response.data.results.map((pokemon) => pokemon.name);
    res.json(pokemonList);
  } catch (error) {
    console.error("Error fetching Pokemon names:", error);
    res.status(502).json({ message: "error" });
  }
});

router.get("/:name", async (req, res) => {
  console.log("Oodsjo");
  try {
    console.log("Fetching Pokémon details from external API...");
    const { name } = req.params;
    const pokemonDetails = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );
    res.json(pokemonDetails.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
