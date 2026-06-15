const LichSuChinhSuaService = require("../services/lichSuChinhSua.service");

const LichSuChinhSuaController = {

    // ================= GET ALL =================
    getAll: async (req, res) => {
        try {
            const data = await LichSuChinhSuaService.getAll(req.query);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Lỗi server" });
        }
    },

    // ================= GET BY ID =================
    getById: async (req, res) => {
        try {
            const data = await LichSuChinhSuaService.getById(req.params.id);

            if (!data) {
                return res.status(404).json({ message: "Không tìm thấy" });
            }

            res.json(data);
        } catch (err) {
            res.status(500).json({ message: "Lỗi server" });
        }
    },

    // ================= CREATE =================
    create: async (req, res) => {
        try {
            const data = await LichSuChinhSuaService.create(req.body);
            res.status(201).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Tạo thất bại" });
        }
    },

    // ================= DELETE =================
    delete: async (req, res) => {
        try {
            const data = await LichSuChinhSuaService.delete(req.params.id);

            if (!data) {
                return res.status(404).json({ message: "Không tìm thấy" });
            }

            res.json({ message: "Đã xóa", data });
        } catch (err) {
            res.status(500).json({ message: "Xóa thất bại" });
        }
    }
};

module.exports = LichSuChinhSuaController;