var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.json({ message: "Welcome to the API" });
});

module.exports = router;
