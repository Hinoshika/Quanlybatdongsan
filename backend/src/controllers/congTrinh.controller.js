const CongTrinhService = require("../services/congTrinh.service");

const CongTrinhController = {

    // ================= GET ALL =================
    getAll: async (req, res) => {

        try {

            const data =
                await CongTrinhService.getAll();

            return res.json(
                data
            );

        } catch (err) {

            return res.status(500).json({
                message: err.message
            });
        }
    },

    // ================= GET BY ID =================
    getById: async (req, res) => {

        try {

            const data =
                await CongTrinhService.getById(
                    req.params.id
                );

            return res.json({
                data
            });

        } catch (err) {

            return res.status(404).json({
                message: err.message
            });
        }
    },

    // ================= SEARCH =================
    search: async (req, res) => {

        try {

            const data =
                await CongTrinhService.search(
                    req.query
                );

            return res.json({
                total: data.length,
                data
            });

        } catch (err) {

            return res.status(500).json({
                message: err.message
            });
        }
    },

    // ================= SEARCH BY CCCD =================
    searchByCCCD: async (req, res) => {

        try {

            const data =
                await CongTrinhService.searchByCCCD(
                    req.params.cccd
                );

            return res.json({
                total: data.length,
                data
            });

        } catch (err) {

            return res.status(400).json({
                message: err.message
            });
        }
    },

    // ================= SEARCH BY MAP =================
    searchByMap: async (req, res) => {

        try {

            const { lat, lng } = req.query;

            const data =
                await CongTrinhService.searchByMap(
                    lat,
                    lng
                );

            return res.json({
                total: data.length,
                data
            });

        } catch (err) {

            return res.status(400).json({
                message: err.message
            });
        }
    },

    // ================= CREATE =================
    create: async (req, res) => {

        try {

            const data =
                await CongTrinhService.create(
                    req.body
                );

            return res.status(201).json({
                message: "Created",
                data
            });

        } catch (err) {

            return res.status(400).json({
                message: err.message
            });
        }
    },

    // ================= UPDATE =================
    update: async (req, res) => {

        try {

            const data =
                await CongTrinhService.update(
                    req.params.id,
                    req.body
                );

            return res.json({
                message: "Updated",
                data
            });

        } catch (err) {

            return res.status(400).json({
                message: err.message
            });
        }
    },

    // ================= DELETE =================
    delete: async (req, res) => {

        try {

            await CongTrinhService.delete(
                req.params.id
            );

            return res.json({
                message: "Deleted"
            });

        } catch (err) {

            return res.status(400).json({
                message: err.message
            });
        }
    }
};

module.exports = CongTrinhController;