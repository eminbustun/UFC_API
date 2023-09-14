const express = require("express");
const userController = require("../controllers/users");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.use(isAuth.protect);
router.use(isAuth.authorize("admin"));

router.route("/").get(userController.getUsers).post(userController.addUser);

router
  .route("/:id")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
