const express = require("express");

const router = express.Router();

const SoHuuThuaDatController =
    require("../controllers/soHuuThuaDat.controller");

// ================= GET ALL =================

router.get(
    "/",
    SoHuuThuaDatController.getAll
);

// ================= GET BY THỬA ĐẤT =================

router.get(
    "/thua-dat/:thuaDatId",
    SoHuuThuaDatController.getByThuaDatId
);

// ================= GET BY ID =================

router.get(
    "/:id",
    SoHuuThuaDatController.getById
);

// ================= CREATE =================

router.post(
    "/",
    SoHuuThuaDatController.create
);

// ================= UPDATE =================

router.put(
    "/:id",
    SoHuuThuaDatController.update
);

// ================= CLOSE OWNERSHIP =================

router.put(
    "/:id/close",
    SoHuuThuaDatController.closeOwnership
);

router.post(
    "/transfer",
    SoHuuThuaDatController.transfer
);

router.delete(
    "/:id",
    SoHuuThuaDatController.delete
);

module.exports = router;