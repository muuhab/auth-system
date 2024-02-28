var express = require("express");
var router = express.Router();
const HouwfoundusController = require("../controllers/howfoundus");
// const { verifyAuthToken } = require("../utils/middleware");
const AuthHelper = require("../utils/middleware");

module.exports = class HouwfoundusRoutes {
  #privateRouter;
  constructor() {
    this.#privateRouter = router;
    this.houwfoundusController = new HouwfoundusController();
    this.#routes();
  }

  #routes() {
    this.#privateRouter.get(
      "/",
      AuthHelper.verifyAuthToken(),
      this.houwfoundusController.findAll
    );
    this.#privateRouter.get(
      "/:id",
      AuthHelper.verifyAuthToken(),
      this.houwfoundusController.findById
    );
    this.#privateRouter.post(
      "/",
      AuthHelper.verifyAuthToken(),
      this.houwfoundusController.create
    );
  }

  getRouter() {
    return this.#privateRouter;
  }
};
