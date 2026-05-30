const express = require("express");
const router = express.Router();

const ThuaDatController = require("../controllers/thuaDat.controller");

// ================= SEARCH =================
router.get("/search", ThuaDatController.search);

router.get("/search/map", ThuaDatController.searchByMap);

// ================= SEARCH BY CCCD (MAP + OWNER) =================
router.get("/cccd/:so_cccd", ThuaDatController.searchByCCCD);

// ================= CRUD =================
router.get("/", ThuaDatController.getAll);
router.get("/:id", ThuaDatController.getById);

router.post("/", ThuaDatController.create);
router.put("/:id", ThuaDatController.update);
router.delete("/:id", ThuaDatController.delete);

module.exports = router;