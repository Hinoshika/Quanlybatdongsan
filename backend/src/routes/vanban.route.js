const express = require("express");

const router = express.Router();

const VanBanController = require("../controllers/vanBan.controller");

router.get("/yeu-cau/:id", VanBanController.taoVanBan);

module.exports = router;
