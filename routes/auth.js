var express = require("express");
var router = express.Router();
const AuthController = require("../controllers/authController");

module.exports = class AuthRoutes {
  #privateRouter;
  constructor() {
    this.#privateRouter = router;
    this.authController = new AuthController();
    this.#routes();
  }

  #routes() {
    this.#privateRouter.post("/register", this.authController.register);
    this.#privateRouter.post("/login", this.authController.login);
    this.#privateRouter.post("/verify/", this.authController.verify);
    this.#privateRouter.post("/generate", this.authController.generate);
  }

  getRouter() {
    return this.#privateRouter;
  }
};
