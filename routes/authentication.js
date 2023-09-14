const express = require("express");
const authenticationController = require("../controllers/authentication");

const router = express.Router();

const isAuth = require("../middleware/isAuth");

router.post("/register", authenticationController.register);
router.post("/login", authenticationController.login);
router.post("/logout", isAuth.protect, authenticationController.logout);

router.get("/me", isAuth.protect, authenticationController.getMe);

router.put(
  "/updatedetails",
  isAuth.protect,
  authenticationController.updateDetails
);

router.post("/forgotpassword", authenticationController.forgotPassword);

router.put(
  "/resetpassword/:resettoken",
  authenticationController.resetPassword
);

router.put(
  "/updatepassword",
  isAuth.protect,
  authenticationController.updatePassword
);

module.exports = router;
