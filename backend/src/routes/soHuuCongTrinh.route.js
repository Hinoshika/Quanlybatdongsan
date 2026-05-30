const express = require("express");

const router = express.Router();

const SoHuuCongTrinhController = require("../controllers/soHuuCongTrinh.controller");
// ================= GET =================
router.get("/", SoHuuCongTrinhController.getAll);

router.get("/cong-trinh/:congTrinhId", SoHuuCongTrinhController.getByCongTrinhId);

router.get("/:id", SoHuuCongTrinhController.getById);

// ================= CRUD =================
router.post("/", SoHuuCongTrinhController.create);

router.put("/:id", SoHuuCongTrinhController.update);

router.delete("/:id", SoHuuCongTrinhController.delete);

// ================= TRANSFER =================
router.post("/transfer", SoHuuCongTrinhController.transferOwnership);

module.exports = router;