const express = require("express");
const multer = require("multer");

const router = express.Router();

const YeuCauController = require("../controllers/yeucau.controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // file văn bản phản hồi
    if (file.fieldname === "van_ban_phan_hoi") {
      cb(null, "uploads/van-ban");
    }

    // file người dân gửi
    else {
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

// lấy danh sách
router.get("/", YeuCauController.getAll);

// lấy chi tiết
router.get("/:id", YeuCauController.getById);

// người dân tạo yêu cầu
router.post("/", upload.array("files", 10), YeuCauController.create);

// cán bộ xử lý
router.put(
  "/:id",

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

// xóa
router.delete("/:id", YeuCauController.remove);

module.exports = router;
