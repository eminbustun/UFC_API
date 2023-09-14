const express = require("express");
const fighterAndFightController = require("../controllers/fighter-fight");

const router = express.Router();

router.route("/:id").get(fighterAndFightController.getFightsOfFighter);

module.exports = router;
