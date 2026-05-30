const express = require("express");
const router = express.Router();

const CongTrinhController = require("../controllers/congTrinh.controller");

// ================= SEARCH =================
router.get("/search", CongTrinhController.search);

// ================= SEARCH BY CCCD =================
router.get(
    "/cccd/:cccd",
    CongTrinhController.searchByCCCD
);

// ================= SEARCH BY MAP =================
router.get(
    "/map",
    CongTrinhController.searchByMap
);


router.get("/", CongTrinhController.getAll);
router.get("/:id", CongTrinhController.getById);

// ================= CRUD =================
router.post("/", CongTrinhController.create);
router.put("/:id", CongTrinhController.update);
router.delete("/:id", CongTrinhController.delete);

module.exports = router;