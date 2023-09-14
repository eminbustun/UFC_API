const express = require("express");
const fighterClubController = require("../controllers/fighter-clubs");

const router = express.Router();

router.route("/:id").get(fighterClubController.getAllFighters);

module.exports = router;
