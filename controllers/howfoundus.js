const db = require("../models");
const zod = require("zod");

module.exports = class {
  async findAll(req, res, next) {
    try {
      const howfoundus = await db.HowFoundUs.findAll();
      res.json({ success: true, data: howfoundus });
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const id = zod
        .string()
        .refine((value) => !isNaN(Number(value)), {
          message: "ID must be a valid number",
        })
        .parse(req.params.id);
      const howfoundus = await db.HowFoundUs.findOne({ where: { id } });
      if (!howfoundus)
        return res.status(404).json({ message: "No data Found" });
      res.json({ success: true, data: howfoundus.dataValues });
    } catch (error) {
      next(error);
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
      next(error);
    }
  }
};
