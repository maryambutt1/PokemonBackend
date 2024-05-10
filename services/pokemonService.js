const axios = require("axios");

async function fetchAllPokemonData(limit, skip) {
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

module.exports = {
  fetchAllPokemonData,
  fetchPokemonDetails,
};
