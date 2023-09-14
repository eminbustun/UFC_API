const express = require("express");
const clubsController = require("../controllers/clubs");

const router = express.Router();

const isAuth = require("../middleware/isAuth");

router
  .route("/")
  .get(clubsController.getClubs)
  .post(isAuth.protect, isAuth.authorize("admin"), clubsController.addClub);

router
  .route("/:id")
  .get(clubsController.getClub)
  .put(isAuth.protect, isAuth.authorize("admin"), clubsController.updateClub)
  .delete(
    isAuth.protect,
    isAuth.authorize("admin"),
    clubsController.deleteClub
  );

module.exports = router;
