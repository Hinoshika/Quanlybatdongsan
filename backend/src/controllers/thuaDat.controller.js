const ThuaDatService = require("../services/thuaDat.service");

const ThuaDatController = {

    getAll: async (req, res) => {
        try {
            const data = await ThuaDatService.getAll();
            res.json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getById: async (req, res) => {
        try {
            const data = await ThuaDatService.getById(req.params.id);
            res.json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // ================= CREATE (FIXED) =================
    create: async (req, res) => {
        try {
            const user = req.user || { id: 1 };

            const result = await ThuaDatService.create(req.body, user);

            res.json({
                success: true,
                data: result
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // ================= UPDATE (FIXED) =================
    update: async (req, res) => {
        try {
            const user = req.user || { id: 1 };
            console.log("📌 CONTROLLER USER:", req.user);
            const result = await ThuaDatService.update(
                req.params.id,
                req.body,
                user
            );

            res.json({
                success: true,
                message: "Cập nhật thành công",
                data: result
            });

        } catch (err) {
            console.error("📌 CONTROLLER ERROR:", err);
            res.status(500).json({ message: err.message });
        }
    },

    // ================= DELETE (FIXED) =================
    delete: async (req, res) => {
        try {
            const user = req.user || { id: 1 };
            const result = await ThuaDatService.delete(
                req.params.id,
                user
            );

            res.json({
                success: true,
                message: "Xóa thành công",
                data: result
            });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    search: async (req, res) => {
        try {
            const data = await ThuaDatService.search(req.query);
            res.json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    searchByCCCD: async (req, res) => {
        try {
            const data = await ThuaDatService.searchByCCCD(req.params.so_cccd);

            res.json({
                total: data.length,
                data
            });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    searchByMap: async (req, res) => {
        try {
            const { lat, lng, radius } = req.query;

            if (!lat || !lng) {
                return res.status(400).json({
                    success: false,
                    message: "Thiếu lat hoặc lng"
                });
            }

            const data = await ThuaDatService.searchByMap(lat, lng, radius);

            res.json({
                success: true,
                total: data.length,
                data
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    // ================= MERGE =================
    merge: async (req, res) => {
        try {
            const user = req.user || { id: 1 };
            const { thua_ids } = req.body;

            const data = await ThuaDatService.merge(
                thua_ids,
                user
            );

            res.json({
                success: true,
                message: "Gộp thửa thành công",
                data
            });

        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    },

    // ================= TACH =================
    tach: async (req, res) => {
        try {
            console.log("📌 TACH REQUEST BODY:");
            console.log(JSON.stringify(req.body, null, 2));

            console.log("📌 COORDS SAMPLE:");
            console.log(req.body?.thua_con?.[0]?.coordinates);

            const result = await ThuaDatService.tach(
                req.body,
                req.user || { id: 1 }
            );

            res.json({
                success: true,
                message: "Tách thửa thành công",
                data: result
            });

        } catch (err) {
            console.error("❌ TACH ERROR:");
            console.error(err);

            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }
};

module.exports = ThuaDatController;