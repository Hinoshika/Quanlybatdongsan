const router = require("express").Router();
const ChuSoHuuController = require("../controllers/chu_so_huu.controller");

// GET all
router.get("/", ChuSoHuuController.getAll);

router.get("/cccd/:cccd", ChuSoHuuController.getByCCCD);

router.get("/:id/tai-san", ChuSoHuuController.getTaiSanByChuSoHuuId);

router.get("/:id", ChuSoHuuController.getById);

router.post("/", ChuSoHuuController.create);

router.put("/:id", ChuSoHuuController.update);

router.delete("/:id", ChuSoHuuController.delete);

module.exports = router;