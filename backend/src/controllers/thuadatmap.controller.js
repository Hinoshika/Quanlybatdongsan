const ThuaDatMapModel = require("../models/thuadatmap.model");

const ThuaDatMapController = {
  getAll: async (req, res) => {
    try {
      const data = await ThuaDatMapModel.getAll();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  getByThuaDatId: async (req, res) => {
    try {
      const { thuaDatId } = req.params;

      const data = await ThuaDatMapModel.getByThuaDatId(thuaDatId);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // =====================================
  // TEST THÊM CHỦ SỞ HỮU
  // =====================================

  addChuSoHuu: async (req, res) => {
    try {
      const data = await ThuaDatMapModel.addChuSoHuu(req.body);

      res.json({
        success: true,

        message: "Thêm chủ sở hữu thành công",

        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const result = await ThuaDatMapModel.create(req.body);

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  },

  update: async (req, res) => {},

  remove: async (req, res) => {},
};

module.exports = ThuaDatMapController;
