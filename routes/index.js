var express = require("express");
var router = express.Router();
const HowFoundUsRouter = require("./howfoundus");
const AuthRouter = require("./auth");

module.exports = class IndexRoutes {
  #privateRouter;
  constructor() {
    this.#privateRouter = router;
    this.howFoundUsRouter = new HowFoundUsRouter().getRouter();
    this.authRouter = new AuthRouter().getRouter();
    this.#routes();
  }

  #routes() {
    this.#privateRouter.get("/", function (req, res, next) {
      res.json({ message: "Welcome to the API" });
    });
    this.#privateRouter.use("/api/howfoundus", this.howFoundUsRouter);
    this.#privateRouter.use("/api", this.authRouter);
  }

  getRouter() {
    return this.#privateRouter;
  }
};
