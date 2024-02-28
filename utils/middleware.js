require("dotenv").config();
const jwt = require("jsonwebtoken");

class AuthHelper {
  generateToken(data) {
    try {
      return jwt.sign({ data }, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error);
    }
  }

  verifyAuthToken() {
    return (req, res, next) => {
      try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(" ")[1];
        if (!token) {
          this.sendUnauthorizedResponse(res, "Access denied, token missing");
        }

        jwt.verify(token, process.env.JWT_SECRET);
        next();
      } catch (error) {
        console.log(error);
        this.sendUnauthorizedResponse(res, "Access denied, invalid token");
      }
    };
  }

  sendUnauthorizedResponse(res, message) {
    res.status(401).json({ message });
  }
}

module.exports = new AuthHelper();
