const ChuSoHuuService = require("../services/chu_so_huu.service");

const ChuSoHuuController = {
    getAll: async (req, res) => {
        try {
            const data = await ChuSoHuuService.getAllChuSoHuu();
            res.json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getById: async (req, res) => {
        try {
            const data = await ChuSoHuuService.getChuSoHuuById(req.params.id);
            if (!data) return res.status(404).json({ message: "Not found" });

            res.json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    create: async (req, res) => {
        try {
            const data = await ChuSoHuuService.createChuSoHuu(req.body);
            res.status(201).json(data);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    update: async (req, res) => {
        try {
            const data = await ChuSoHuuService.updateChuSoHuu(
                req.params.id,
                req.body
            );
            res.json(data);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    delete: async (req, res) => {
        try {
            const data = await ChuSoHuuService.deleteChuSoHuu(req.params.id);
            res.json({ message: "Deleted successfully", data });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // 🔥 THÊM MỚI: kiểm tra tài sản
    getTaiSanByChuSoHuuId: async (req, res) => {
        try {
            const data = await ChuSoHuuService.getTaiSanByChuSoHuuId(req.params.id);
            res.json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getByCCCD: async (req, res) => {
        try {
            const data = await ChuSoHuuService.getChuSoHuuByCCCD(req.params.cccd);

            if (!data) {
                return res.status(404).json({ message: "Không tìm thấy chủ sở hữu" });
            }

            res.json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
};

module.exports = ChuSoHuuController;