const axios = require("axios");
const pokemonService = require("../services/pokemonService");
const PokemonDetails = require("../models/PokemonDetails");
const Pokemon = require("../models/Pokemon");

async function fetchPokemonData(req, res) {
  try {
    const { page } = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * limit || 0;

    const existingPokemonData = await Pokemon.find().skip(skip).limit(limit);
    if (existingPokemonData.length > 0) {
      console.log("Pokémon data already exists in the database");
      return res.json(existingPokemonData);
    }

    console.log("Fetching Pokémon data from external API...");
    const pokemonData = await pokemonService.fetchAllPokemonData(limit, skip);

    await Pokemon.deleteMany({});
    await PokemonDetails.deleteMany({});

    const pokemonDetailsArray = [];
    for (const pokemon of pokemonData) {
      const newPokemon = new Pokemon({
        name: pokemon.name,
        url: pokemon.url,
      });
      await newPokemon.save();

      const pokemonDetailData = await pokemonService.fetchPokemonDetails(
        pokemon.url
      );

      const abilities = pokemonDetailData.abilities.map((abilityEntry) => {
        return {
          ability: {
            name: abilityEntry.ability.name,
            url: abilityEntry.ability.url,
          },
          is_hidden: abilityEntry.is_hidden,
          slot: abilityEntry.slot,
        };
      });
      const forms = pokemonDetailData.forms.map((formEntry) => {
        return {
          name: formEntry.name,
          url: formEntry.url,
        };
      });
      const gameIndices = pokemonDetailData.game_indices.map(
        (gameIndexEntry) => {
          return {
            game_index: gameIndexEntry.game_index,
            version: {
              name: gameIndexEntry.version.name,
              url: gameIndexEntry.version.url,
            },
          };
        }
      );

      const newPokemonDetail = new PokemonDetails({
        pokemonId: newPokemon._id,
        name: pokemonDetailData.name,
        abilities: abilities,
        cries: {
          latest: pokemonDetailData.cries.latest,
          legacy: pokemonDetailData.cries.legacy,
        },
        forms: forms,
        game_indices: gameIndices,
        species: {
          name: pokemonDetailData.species.name,
          url: pokemonDetailData.species.url,
        },
        base_experience: pokemonDetailData.base_experience,
        order: pokemonDetailData.order,
        is_default: pokemonDetailData.is_default,
        height: pokemonDetailData.height,
        weight: pokemonDetailData.weight,
        location_area_encounters: pokemonDetailData.location_area_encounters,
      });
      pokemonDetailsArray.push(newPokemonDetail);
    }

    await PokemonDetails.insertMany(pokemonDetailsArray);

    res.json(pokemonDetailsArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function fetchPokemonNames(req, res) {
  try {
    const existingPokemonData = await Pokemon.find();

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
}

async function fetchPokemonDetails(req, res) {
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
}

module.exports = {
  fetchPokemonData,
  fetchPokemonNames,
  fetchPokemonDetails
};
