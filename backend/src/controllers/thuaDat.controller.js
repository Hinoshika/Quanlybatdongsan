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

    create: async (req, res) => {
        try {
            await ThuaDatService.create(req.body);

            res.json({
                success: true,
                message: "Thêm thửa đất thành công"
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    },

    update: async (req, res) => {
        try {
            await ThuaDatService.update(req.params.id, req.body);
            res.json({ message: "Updated" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    delete: async (req, res) => {
        try {
            await ThuaDatService.delete(req.params.id);
            res.json({ message: "Deleted" });
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

    // ================= CCCD SEARCH =================
    searchByCCCD: async (req, res) => {
        try {
            const so_cccd = req.params.so_cccd;

            const data = await ThuaDatService.searchByCCCD(so_cccd);

            res.json({
                total: data.length,
                data
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // ================= SEARCH BY MAP (MỚI THÊM) =================
    searchByMap: async (req, res) => {
        try {
            const { lat, lng, radius } = req.query;

            if (!lat || !lng) {
                return res.status(400).json({
                    success: false,
                    message: "Thiếu tham số lat hoặc lng"
                });
            }

            const data = await ThuaDatService.searchByMap(lat, lng, radius);

            res.json({
                success: true,
                total: data.length,
                data
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: err.message || "Lỗi server khi tìm kiếm theo bản đồ"
            });
        }
    },
    // ================= GỘP THỬA =================
    merge: async (req, res) => {
        console.log("BODY:", req.body);
        try {

            const { thua_ids } = req.body;

            const data =
                await ThuaDatService.merge(
                    thua_ids
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
    tach: async (req, res) => {

        console.log(
            JSON.stringify(req.body, null, 2)
        );

        try {
            const result =
                await ThuaDatService.tach(
                    req.body
                );

            res.json({
                success: true,
                message: "Tách thửa thành công",
                data: result
            });

        } catch (err) {

            console.log(err);

            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    },
};

module.exports = ThuaDatController;