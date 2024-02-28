var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { ZodError } = require("zod");

const indexRouter = require("./routes/index");
const howfoundusRouter = require("./routes/howfoundus");
const authRouter = require("./routes/auth");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/howfoundus", howfoundusRouter);
app.use("/api", authRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
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

module.exports = app;
