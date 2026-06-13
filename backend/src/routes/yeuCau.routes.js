const express = require("express");
const router = express.Router();

const YeuCauController = require("../controllers/yeucau.controller");

router.get("/", YeuCauController.getAll);

router.get("/:id", YeuCauController.getById);

router.post("/", YeuCauController.create);

router.put("/:id", YeuCauController.update);

router.delete("/:id", YeuCauController.remove);

module.exports = router;