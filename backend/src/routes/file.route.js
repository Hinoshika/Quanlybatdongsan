const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;

  const filepath = path.join(__dirname, "../../uploads/yeu-cau", filename);

  if (!fs.existsSync(filepath)) {
    return res.status(404).json({
      message: "Không tìm thấy file",
      path: filepath,
    });
  }

  res.download(filepath);
});

module.exports = router;
