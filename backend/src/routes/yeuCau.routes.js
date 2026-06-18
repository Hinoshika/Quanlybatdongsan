const express = require("express");
const multer = require("multer");

const router = express.Router();

const YeuCauController = require("../controllers/yeucau.controller");

const { verifyToken } = require("../middleware/auth.middleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "van_ban_phan_hoi") {
      cb(null, "uploads/van-ban");
    } else {
      cb(null, "uploads/yeu-cau");
    }
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
});
console.log("verifyToken =", verifyToken);
console.log("getAll =", YeuCauController.getAll);
console.log("getMyYeuCau =", YeuCauController.getMyYeuCau);

// ================================
// ADMIN LẤY TẤT CẢ
// ================================

router.get("/", verifyToken, YeuCauController.getAll);

// ================================
// USER LẤY YÊU CẦU CỦA MÌNH
// ================================

router.get("/my", verifyToken, YeuCauController.getMyYeuCau);

// ================================
// CHI TIẾT
// ================================

router.get("/:id", verifyToken, YeuCauController.getById);

// ================================
// NGƯỜI DÂN TẠO
// ================================

router.post(
  "/",
  verifyToken,

  upload.array("files", 10),

  YeuCauController.create,
);

// ================================
// CÁN BỘ CẬP NHẬT
// ================================

router.put(
  "/:id",

  verifyToken,

  upload.fields([
    {
      name: "files",
      maxCount: 10,
    },

    {
      name: "van_ban_phan_hoi",
      maxCount: 10,
    },
  ]),

  YeuCauController.update,
);

// ================================
// XÓA
// ================================

router.delete(
  "/:id",

  verifyToken,

  YeuCauController.remove,
);

module.exports = router;
