const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoute = require("./routes/auth.route");
const thuaDatRoutes = require("./routes/thuadat.route");
const congTrinhRoutes = require("./routes/congTrinh.route");
const userRoutes = require("./routes/user.route");
const chuSoHuuRoutes = require("./routes/chu_so_huu.route");
const bienDongRoutes = require("./routes/bienDong.router");
const soHuuThuaDatRoutes = require("./routes/soHuuThuaDat.route");
const soHuuCongTrinhRoutes = require("./routes/soHuuCongTrinh.route");
const yeuCauRoutes = require("./routes/yeuCau.routes");
const chatRoute = require("./routes/chat.route");
const lichSuChinhSuaRoutes = require("./routes/lichSuChinhSua.routes");
const vanBanRoutes = require("./routes/vanBan.route");
const fileRouter = require("./routes/file.route");

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// STATIC FILES
// =====================
// =====================
// STATIC FILES
// =====================
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// =====================
// ROUTES
// =====================
app.use("/api/auth", authRoute);
app.use("/api/users", userRoutes);
app.use("/api/thua-dat", thuaDatRoutes);
app.use("/api/cong-trinh", congTrinhRoutes);
app.use("/api/chu-so-huu", chuSoHuuRoutes);
app.use("/api/bien-dong", bienDongRoutes);
app.use("/api/so-huu-thua-dat", soHuuThuaDatRoutes);
app.use("/api/so-huu-cong-trinh", soHuuCongTrinhRoutes);
app.use("/api/yeu-cau", yeuCauRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/lich-su-chinh-sua", lichSuChinhSuaRoutes);
app.use("/api/van-ban", vanBanRoutes);
app.use("/api/file", fileRouter);

// =====================
// HEALTH CHECK
// =====================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
