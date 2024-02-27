require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.generateToken = (data) => {
  try {
    return jwt.sign({ data }, process.env.JWT_SECRET);
  } catch (error) {
    console.log(error);
  }
};

exports.verifyAuthToken = () => {
  return (req, res, next) => {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader?.split(" ")[1];
      if (!token) {
        res.status(401);
        res.json({ message: "Access denied, token missing" });
      }
      jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (error) {
      console.log(error);
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401);
        res.json({ message: "Access denied, invalid token" });
      } else {
        res.status(401);
        res.json(errorRes(401, "Access denied, invalid token"));
        return;
      }
    }
  };
};
