const express = require("express");
const multer = require("multer");

const router = express.Router();

const YeuCauController = require("../controllers/yeucau.controller");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/yeu-cau");
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + "-" + file.originalname
        );
    }
});

const upload = multer({
    storage
});

router.get("/", YeuCauController.getAll);

router.get("/:id", YeuCauController.getById);

router.post(
    "/",
    upload.array("files", 10),
    YeuCauController.create
);

router.put("/:id", upload.array("files", 10), YeuCauController.update);

router.delete("/:id", YeuCauController.remove);

module.exports = router;