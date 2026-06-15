const express = require("express");
const router = express.Router();

const ThuaDatController = require("../controllers/thuaDat.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// ================= PUBLIC =================
router.get("/search", ThuaDatController.search);
router.get("/search/map", ThuaDatController.searchByMap);
router.get("/cccd/:so_cccd", ThuaDatController.searchByCCCD);

// ================= PROTECTED =================

// ================= CRUD =================
router.get("/", ThuaDatController.getAll);
router.get("/:id", ThuaDatController.getById);

router.post("/", ThuaDatController.create);
router.put("/:id", ThuaDatController.update);
router.delete("/:id", ThuaDatController.delete);

// ================= ACTION =================
router.post("/merge", ThuaDatController.merge);
router.post("/tach", ThuaDatController.tach);

module.exports = router;