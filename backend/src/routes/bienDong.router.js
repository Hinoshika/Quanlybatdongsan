const express = require("express");
const router = express.Router();

const BienDongController = require("../controllers/bienDong.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// ================= ROUTES =================

// GET ALL
router.get("/", BienDongController.getAll);

// GET BY ID
router.get("/:id", BienDongController.getById);

// CREATE (FIX Ở ĐÂY)
router.post("/", verifyToken, BienDongController.create);

// UPDATE
router.put("/:id", verifyToken, BienDongController.update);

// DELETE
router.delete("/:id", verifyToken, BienDongController.delete);

module.exports = router;