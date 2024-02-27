const db = require("../models");
const zod = require("zod");

module.exports = class {
  async findAll(req, res, next) {
    try {
      const howfoundus = await db.HowFoundUs.findAll();
      res.json({ success: true, data: howfoundus });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError")
        return res.status(400).json({ message: error.errors[0].message });
      res.status(400).json(error);
    }
  }

  async findById(req, res, next) {
    try {
      const id = req.params.id;
      const howfoundus = await db.HowFoundUs.findOne({ where: { id } });
      if (!howfoundus) return res.status(404).json({ message: "Not Found" });
      res.json({ success: true, data: howfoundus.dataValues });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError")
        return res.status(400).json({ message: error.errors[0].message });
      res.status(400).json(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = zod
        .object({
          name: zod.string(),
        })
        .parse(req.body);
      const howfoundus = await db.HowFoundUs.create({ value: data.name });
      res.json({
        success: true,
        message: "How Found Us created successfully",
        howfoundus,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError")
        return res.status(400).json({ message: error.errors[0].message });
      res.status(400).json(error);
    }
  }
};
