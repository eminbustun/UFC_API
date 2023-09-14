const express = require("express");
const fightersController = require("../controllers/fighters");

const router = express.Router();

const isAuth = require("../middleware/isAuth");

router
  .route("/")
  .get(fightersController.getFighters)
  .post(
    isAuth.protect,
    isAuth.authorize("admin"),
    fightersController.addFighter
  );

router
  .route("/list")
  .post(
    isAuth.protect,
    isAuth.authorize("admin"),
    fightersController.addFighterList
  );

router
  .route("/:id")
  .get(fightersController.getFighter)
  .put(
    isAuth.protect,
    isAuth.authorize("admin"),
    fightersController.updateFighter
  )
  .delete(
    isAuth.protect,
    isAuth.authorize("admin"),
    fightersController.deleteFighter
  );

module.exports = router;
