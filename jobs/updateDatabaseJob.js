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

    // Update the database with fetched data
    await Pokemon.deleteMany({});
    await Pokemon.insertMany(pokemonData);

    console.log("Database updated successfully.");
  } catch (error) {
    console.error("Error updating database:", error);
  }
};

// Schedule the job
const job = schedule.scheduleJob(jobSchedule, updateDatabaseJob);
