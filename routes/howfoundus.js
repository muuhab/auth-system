var express = require("express");
var router = express.Router();
const HouwfoundusController = require("../controllers/howfoundus");
const { verifyAuthToken } = require("../utils/middleware");

const howfoundusController = new HouwfoundusController();

router.get("/", verifyAuthToken(), howfoundusController.findAll);
router.get("/:id", verifyAuthToken(), howfoundusController.findById);
router.post("/", verifyAuthToken(), howfoundusController.create);

module.exports = router;
