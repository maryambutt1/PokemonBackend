const express = require("express");
const router = express.Router();
const axios = require("axios");
const PokemonDetails = require("../models/PokemonDetails");
const Pokemon = require("../models/Pokemon");

router.get("/fetch", async (req, res) => {
  try {
    const { page } = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * limit || 0;

    // Check if data exists in the database
    const existingPokemonData = await Pokemon.find().skip(skip).limit(limit);
     // If data exists, return it
     if (existingPokemonData.length > 0) {
       console.log("Pokémon data already exists in the database");
       return res.json(existingPokemonData);
     }

    console.log("Fetching Pokémon data from external API...");
    const pokemonData = await fetchAllPokemonData(limit, skip);

    await Pokemon.deleteMany({});

    // Clear existing data in the collection before inserting new data
    await PokemonDetails.deleteMany({});

    // Create an array to hold the Pokemon details
    const pokemonDetailsArray = [];

    // Fetch detailed data for each Pokemon
    for (const pokemon of pokemonData) {
      // Construct a new Pokemon object
      const newPokemon = new Pokemon({
        name: pokemon.name,
        url: pokemon.url,
      });
        await newPokemon.save();

        const pokemonDetailData = await fetchPokemonDetails(pokemon.url);

        const abilities = pokemonDetailData.abilities.map((abilityEntry) => {
          return {
            ability: {
              name: abilityEntry.ability.name,
              url: abilityEntry.ability.url
            },
            is_hidden: abilityEntry.is_hidden,
            slot: abilityEntry.slot
          };
        });

      // Construct a new PokemonDetails object
      const newPokemonDetail = new PokemonDetails({
        pokemonId: newPokemon._id, // Set the reference to Pokemon
        name: pokemonDetailData.name,
        abilities: abilities, // Assign abilities array
        base_experience: pokemonDetailData.base_experience,
        order: pokemonDetailData.order,
        is_default: pokemonDetailData.is_default,
        height: pokemonDetailData.height,
        weight: pokemonDetailData.weight,
        location_area_encounters: pokemonDetailData.location_area_encounters,
        
      });
      // Add the new PokemonDetails object to the array
      pokemonDetailsArray.push(newPokemonDetail);

    }

    // Insert new data into the collection using insertMany
    await PokemonDetails.insertMany(pokemonDetailsArray);

    res.json(pokemonDetailsArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
async function fetchAllPokemonData(limit,skip) {
  let pokemonData = [];
  let nextUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${skip}`;
  while (nextUrl) {
    const response = await axios.get(nextUrl);
    const data = response.data;
    pokemonData = [...pokemonData, ...data.results];
    nextUrl = data.next;
  }
  return pokemonData;
}
async function fetchPokemonDetails(url) {
  const response = await axios.get(url);
  return response.data;
}

router.get("/names", async (req, res) => {
  try {
    const existingPokemonData = await Pokemon.find();

    // If data exists, return it
    if (existingPokemonData.length > 0) {
      console.log("Pokémon names already exist in the database");
      const pokemonList = existingPokemonData.map((pokemon) => pokemon.name);
      return res.json(pokemonList);
    }
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
