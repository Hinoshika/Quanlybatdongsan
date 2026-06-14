const express = require("express");
const router = express.Router();

const ThuaDatController = require("../controllers/thuaDat.controller");

// ================= SEARCH =================
router.get("/search", ThuaDatController.search);
router.get("/search/map", ThuaDatController.searchByMap);

// ================= SEARCH CCCD =================
router.get("/cccd/:so_cccd", ThuaDatController.searchByCCCD);

// ================= GỘP THỬA =================
router.post("/merge", ThuaDatController.merge);

router.post("/tach", ThuaDatController.tach);

// ================= CRUD =================
router.get("/", ThuaDatController.getAll);
router.get("/:id", ThuaDatController.getById);

router.post("/", ThuaDatController.create);
router.put("/:id", ThuaDatController.update);
router.delete("/:id", ThuaDatController.delete);

module.exports = router;