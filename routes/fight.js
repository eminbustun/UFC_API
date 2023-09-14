const express = require("express");
const fightController = require("../controllers/fight");

const router = express.Router();

const isAuth = require("../middleware/isAuth");

router
  .route("/")
  .get(fightController.getFights)
  .post(isAuth.protect, isAuth.authorize("admin"), fightController.addFight);

router
  .route("/:id")
  .put(isAuth.protect, isAuth.authorize("admin"), fightController.updateFight)
  .get(fightController.getFight);

router
  .route("/add-fights-as-list")
  .post(
    isAuth.protect,
    isAuth.authorize("admin"),
    fightController.addFightsAsAList
  );

module.exports = router;
