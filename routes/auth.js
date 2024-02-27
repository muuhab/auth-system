var express = require("express");
var router = express.Router();
const AuthController = require("../controllers/authController");

const db = require("../models");

const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify/", authController.verify);
router.post("/generate", authController.generate);

module.exports = router;
