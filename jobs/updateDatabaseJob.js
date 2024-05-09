const schedule = require("node-schedule");
const axios = require("axios");
const Pokemon = require("../models/Pokemon");

const jobSchedule = "0 0 * * *"; // At midnight every day

const updateDatabaseJob = async () => {
  try {
    console.log(
      "Running scheduled job to update database with external API..."
    );

    // Fetch data from the external API
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
    const pokemonData = response.data.results;

    // Fetch existing data from the database
    const existingPokemonData = await Pokemon.find();

    // Compare fetched data with existing data
    const isEqual = compareData(existingPokemonData, pokemonData);

    // If data is different, update the database
    if (!isEqual) {
      await Pokemon.deleteMany({});
      await Pokemon.insertMany(pokemonData);
      console.log("Database updated successfully.");
    } else {
      console.log("Data from external API is same as existing data. No update needed.");
    }
  } catch (error) {
    console.error("Error updating database:", error);
  }
};

const compareData = (existingData, newData) => {
  // Check if the length of both arrays is the same
  if (existingData.length !== newData.length) {
    return false;
  }

  // Sort the arrays by name for consistent comparison
  const sortedExistingData = existingData.sort((a, b) => a.name.localeCompare(b.name));
  const sortedNewData = newData.sort((a, b) => a.name.localeCompare(b.name));

  // Compare each item in the arrays
  for (let i = 0; i < sortedExistingData.length; i++) {
    const existingPokemon = sortedExistingData[i];
    const newPokemon = sortedNewData[i];

    // Compare name and URL of each Pokemon
    if (existingPokemon.name !== newPokemon.name || existingPokemon.url !== newPokemon.url) {
      return false; // Data is different
    }
  }

  // If all items are the same, return true
  return true;
};


// Schedule the job
const job = schedule.scheduleJob(jobSchedule, updateDatabaseJob);
