const BienDongService = require("../services/bienDong.service");

const BienDongController = {

    // ================= GET ALL =================
    getAll: async (req, res) => {

        try {

            console.log("REQ QUERY:", req.query);

            const data =
                await BienDongService.getAllBienDong(req.query);

            res.json(data);

        }
        catch (err) {

            res.status(500).json({
                message: err.message
            });
        }
    },

    // ================= GET BY ID =================
    getById: async (req, res) => {

        try {

            const { id } = req.params;

            const data =
                await BienDongService.getBienDongById(id);

            if (!data) {

                return res.status(404).json({
                    message: "Không tìm thấy biến động"
                });
            }

            res.json(data);

        }
        catch (err) {

            res.status(500).json({
                message: err.message
            });
        }
    },

    // ================= CREATE =================
    create: async (req, res) => {
        try {
            console.log("BODY:", req.body);
            console.log("USER:", req.user);

            const payload = {
                ...req.body,
                nguoi_tao: req.user.id
            };

            const data = await BienDongService.createBienDong(payload);

            res.status(201).json({
                message: "Tạo biến động thành công",
                data
            });

        } catch (err) {
            console.log("ERROR:", err.message);

            res.status(400).json({
                message: err.message
            });
        }
    },

    // ================= UPDATE =================
    update: async (req, res) => {

        try {

            const { id } = req.params;

            const data =
                await BienDongService.updateBienDong(
                    id,
                    req.body
                );

            if (!data) {

                return res.status(404).json({
                    message: "Không tìm thấy biến động"
                });
            }

            res.json({
                message: "Cập nhật biến động thành công",
                data
            });

        }
        catch (err) {

            res.status(400).json({
                message: err.message
            });
        }
    },

    // ================= DELETE =================
    delete: async (req, res) => {

        try {

            const { id } = req.params;

            const data =
                await BienDongService.deleteBienDong(id);

            if (!data) {

                return res.status(404).json({
                    message: "Không tìm thấy biến động"
                });
            }

            res.json({
                message: "Xóa biến động thành công",
                data
            });

        }
        catch (err) {

            res.status(500).json({
                message: err.message
            });
        }
    }
};

module.exports = BienDongController;