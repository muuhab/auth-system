const speakeasy = require("speakeasy");
const registerSchema = require("../validations/register.schema");
const loginSchema = require("../validations/login.schema");
const verifySchema = require("../validations/verify.schema");
const { generateToken } = require("../utils/middleware");
const zod = require("zod");
const bcrypt = require("bcrypt");

const db = require("../models");

module.exports = class AuthController {
  async register(req, res, next) {
    try {
      const data = registerSchema.parse(req.body);
      const howfoundus = await db.HowFoundUs.findOne({
        where: { id: data.howfoundusId },
      });
      if (!howfoundus)
        return res.status(400).json({ message: "Invalid How Found Us" });
      const secret = speakeasy.generateSecret().base32;
      data.secret = secret;
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
      const user = await db.User.create({ ...data });
      const otp = speakeasy.totp({
        secret,
        digits: 5,
        encoding: "base32",
        step: 240,
      });
      await db.OTP.create({
        UserId: user?.dataValues?.id,
        otp,
        status: "active",
      });
      res.json({ success: true, id: user.id, message: "OTP Sent", otp });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError")
        return res.status(400).json({ message: error.errors[0].message });
      res.status(400).json(error);
    }
  }
  async login(req, res, next) {
    try {
      const data = loginSchema.parse(req.body);

      const user = await db.User.findOne({ where: { id: data.userId } });
      if (!user)
        return res.status(400).json({ message: "Invalid email or password" });
      const validPassword = await bcrypt.compare(
        data.password,
        user.dataValues.password
      );
      if (!validPassword)
        return res.status(400).json({ message: "Invalid email or password" });

      if (user.dataValues.verified === false) {
        const otp = speakeasy.totp({
          secret: user.dataValues.secret,
          digits: 5,
          encoding: "base32",
          step: 240,
        });
        return res.status(200).json({
          success: false,
          id: user.dataValues.id,
          message: "OTP sent",
          otp,
        });
      }
      const token = generateToken({
        id: user.dataValues.id,
        name: user.dataValues.firstName + " " + user.dataValues.lastName,
      });
      res.json({ success: true, token, name: user.name, token });
    } catch (error) {
      res.status(400).json(error);
    }
  }

  async verify(req, res, next) {
    try {
      const data = verifySchema.parse(req.body);
      const user = await db.User.findOne({ where: { id: data.userId } });
      if (!user) return res.status(400).json({ message: "Invalid user" });
      const verify = speakeasy.totp.verify({
        secret: user.dataValues.secret,
        encoding: "base32",
        token: data.otp,
        digits: 5,
        step: 240,
      });
      if (!verify) return res.status(400).json({ message: "Token Expired" });
      await db.User.update({ verified: true }, { where: { id: data.userId } });
      await db.OTP.update(
        { status: "used" },
        { where: { UserId: data.userId } }
      );
      res.json({ success: true });
    } catch (error) {
      res.status(400).json(error);
    }
  }
  async generate(req, res, next) {
    try {
      const userId = zod
        .object({ userId: zod.string() })
        .parse(req.body).userId;
      const user = await db.User.findOne({ where: { id: userId } });
      if (!user) return res.status(400).json({ message: "Invalid user" });
      await db.OTP.update({ status: "expired" }, { where: { UserId: userId } });
      const otp = speakeasy.totp({
        secret: user.dataValues.secret,
        digits: 5,
        encoding: "base32",
        step: 30,
      });
      await db.OTP.create({
        UserId: user?.dataValues?.id,
        otp,
        status: "active",
      });

      res.json({ success: true, otp });
    } catch (error) {
      res.status(400).json(error);
    }
  }
  me = async (req, res, next) => {
    try {
      res.json(req.user);
    } catch (error) {
      res.status(400).json(error);
    }
  };
  logout = async (req, res, next) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(400).json(error);
    }
  };
};
