const express = require("express");
const router = express.Router();

const controller = require("../controllers/lichSuChinhSua.controller");

// ================= GET ALL =================
router.get("/", controller.getAll);

// ================= GET BY ID =================
router.get("/:id", controller.getById);

// ================= CREATE =================
router.post("/", controller.create);

// ================= DELETE =================
router.delete("/:id", controller.delete);

module.exports = router;