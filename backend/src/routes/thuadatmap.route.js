const express = require("express");

const router = express.Router();

const ThuaDatMapController = require("../controllers/thuadatmap.controller");

// GET ALL
router.get("/", ThuaDatMapController.getAll);

// GET BY THUA DAT
router.get("/thua-dat/:thuaDatId", ThuaDatMapController.getByThuaDatId);

// CREATE
router.post("/", ThuaDatMapController.create);

// UPDATE
router.put("/:id", ThuaDatMapController.update);

// DELETE
router.delete("/:id", ThuaDatMapController.remove);

module.exports = router;
