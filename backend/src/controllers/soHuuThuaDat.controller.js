const SoHuuThuaDatService =
    require("../services/soHuuThuaDat.service");

const SoHuuThuaDatController = {

    // ================= GET ALL =================

    getAll: async (req, res) => {

        try {

            const data =
                await SoHuuThuaDatService.getAll();

            res.json(data);

        } catch (err) {

            console.log(err);

            res.status(500).json({
                message: err.message
            });
        }
    },

    // ================= GET BY ID =================

    getById: async (req, res) => {

        try {

            const data =
                await SoHuuThuaDatService.getById(
                    req.params.id
                );

            res.json(data);

        } catch (err) {

            res.status(500).json({
                message: err.message
            });
        }
    },

    // ================= GET BY THỬA ĐẤT =================

    getByThuaDatId: async (req, res) => {

        try {

            const data =
                await SoHuuThuaDatService.getByThuaDatId(
                    req.params.thuaDatId
                );

            res.json(data);

        } catch (err) {

            res.status(500).json({
                message: err.message
            });
        }
    },

    // ================= CREATE =================

    create: async (req, res) => {

        try {

            const data =
                await SoHuuThuaDatService.create(
                    req.body
                );

            res.status(201).json(data);

        } catch (err) {

            res.status(500).json({
                message: err.message
            });
        }
    },

    // ================= UPDATE =================

    update: async (req, res) => {

        try {

            const data =
                await SoHuuThuaDatService.update(
                    req.params.id,
                    req.body
                );

            res.json(data);

        } catch (err) {

            res.status(500).json({
                message: err.message
            });
        }
    },

    // ================= CLOSE =================

    closeOwnership: async (req, res) => {

        try {

            const data =
                await SoHuuThuaDatService.closeOwnership(
                    req.params.id,
                    req.body.ngay_ket_thuc
                );

            res.json(data);

        } catch (err) {

            res.status(500).json({
                message: err.message
            });
        }
    },

    // ================= DELETE =================

    delete: async (req, res) => {

        try {

            await SoHuuThuaDatService.delete(
                req.params.id
            );

            res.json({
                message: "Xóa thành công"
            });

        } catch (err) {

            res.status(500).json({
                message: err.message
            });
        }
    },

    transfer: async (req, res) => {
        try {
            console.log("🔥 CONTROLLER BODY:", req.body);

            const result =
                await SoHuuThuaDatService.transferOwnership(req.body);

            res.json({
                message: "Chuyển nhượng thành công",
                data: result
            });

        } catch (err) {
            console.log("❌ CONTROLLER ERROR:", err.message);

            res.status(500).json({
                message: err.message
            });
        }
    },
};

module.exports = SoHuuThuaDatController;