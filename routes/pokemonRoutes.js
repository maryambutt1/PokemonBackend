const express = require("express");
const router = express.Router();
const pokemonController = require("../controllers/pokemonController");

router.get("/fetch", pokemonController.fetchPokemonData);
router.get("/names", pokemonController.fetchPokemonNames);
router.get("/:name", pokemonController.fetchPokemonDetails);

module.exports = router;
