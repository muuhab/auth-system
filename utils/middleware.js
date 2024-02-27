require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.generateToken = (data) => {
  try {
    return jwt.sign({ data }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyAuthToken = (role) => {
  return (req, res, next) => {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (error) {
      res.status(401);
      res.json(errorRes(401, "Access denied, invalid token"));
      return;
    }
  };
};
