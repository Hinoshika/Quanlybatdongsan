const YeuCauService = require("../services/yeuCau.service");

const YeuCauController = {
  // ================= GET ALL =================

  getAll: async (req, res) => {
    try {
      const data = await YeuCauService.getAll();

      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  // ================= GET BY ID =================

  getById: async (req, res) => {
    try {
      const data = await YeuCauService.getById(req.params.id);

      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  // ================= CREATE =================

  create: async (req, res) => {
    try {
      const payload = {
        ...req.body,

        tep_dinh_kem:
          req.files?.map((file) => ({
            ten_file: file.originalname,

            duong_dan: file.path.replace(/\\/g, "/"),

            loai_file: file.mimetype,

            kich_thuoc: file.size,
          })) || [],
      };

      const data = await YeuCauService.create(payload, req.user);

      res.status(201).json(data);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  },

  // ================= UPDATE =================

  update: async (req, res) => {
    try {
      let vanBan = [];

      // file cán bộ trả
      if (req.files && req.files.van_ban_phan_hoi) {
        vanBan = req.files.van_ban_phan_hoi.map((file) => ({
          ten_file: file.originalname,

          duong_dan: file.path.replace(/\\/g, "/"),

          loai_file: file.mimetype,

          kich_thuoc: file.size,
        }));
      }

      const old = await YeuCauService.getById(req.params.id);

      const payload = {
        trang_thai: req.body.trang_thai,

        ghi_chu_xu_ly: req.body.ghi_chu_xu_ly || "",

        nguoi_xu_ly_id: req.user?.id || null,

        van_ban_phan_hoi: [...(old.van_ban_phan_hoi || []), ...vanBan],
      };

      console.log("PAYLOAD UPDATE:", payload);

      const data = await YeuCauService.update(
        req.params.id,

        payload,

        req.user,
      );

      res.json(data);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  },

  // ================= DELETE =================

  remove: async (req, res) => {
    try {
      const data = await YeuCauService.remove(
        req.params.id,

        req.user,
      );

      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = YeuCauController;
