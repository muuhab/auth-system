const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { ZodError } = require("zod");
const createError = require("http-errors");
const IndexRouter = require("./routes/index");

class MyApp {
  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  setupMiddlewares() {
    this.app.use(logger("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  setupRoutes() {
    const indexRouter = new IndexRouter().getRouter();
    this.app.use(indexRouter);
  }

  setupErrorHandlers() {
    this.app.use((req, res, next) => {
      next(createError(404));
    });

    this.app.use((err, req, res, next) => {
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      if (err instanceof ZodError) {
        const errors = err.errors.map((error) => {
          if (error.path.length === 0)
            return {
              message: error.message,
            };
          else
            return {
              field: error.path.join("."),
              message: error.message,
            };
        });
        return res.status(400).json({ success: false, message: errors });
      }

      if (err.name === "SequelizeUniqueConstraintError") {
        const errors = err.errors.map((error) => {
          return {
            field: error.path,
            message: error.message,
          };
        });
        return res.status(400).json({ success: false, message: errors });
      }
      res.status(err.status || 500);
      res.json({ message: err.message });
    });
  }
}

module.exports = MyApp;
