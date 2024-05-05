const express = require('express');
const router = express.Router();
const axios = require('axios');
const PokemonDetails = require('../models/PokemonDetails');
const Pokemon = require('../models/Pokemon');

router.get('/fetch', async (req, res) => {
  try {
    console.log("Fetching Pokémon data from external API...");
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
    const pokemonData = response.data.results;

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
        // Include other attributes as needed
      };

      // Add the new PokemonDetails object to the array
      pokemonDetailsArray.push(newPokemonDetail);
    }

    // Insert new data into the collection using insertMany
    await PokemonDetails.insertMany(pokemonDetailsArray);

    res.json(pokemonDetailsArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// New route to fetch Pokémon details by name
router.get('/:name', async (req, res) => {
    try {
        console.log("Fetching Pokémon details from external API...");
        const { name } = req.params;
        const pokemonDetails = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        res.json(pokemonDetails.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
