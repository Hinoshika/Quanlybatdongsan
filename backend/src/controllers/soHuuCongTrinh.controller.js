const SoHuuCongTrinhService = require(
    "../services/soHuuCongTrinh.service"
);

const SoHuuCongTrinhController = {

    // ================= GET ALL =================
    getAll: async (req, res) => {

        try {

            const data =
                await SoHuuCongTrinhService.getAll();

            res.json(data);

        } catch (err) {

            res.status(500).json({
                message: err.message
            });
        }
    },

    // ================= GET BY ID =================
    getById: async (req, res) => {

        try {

            const data =
                await SoHuuCongTrinhService.getById(
                    req.params.id
                );

            res.json(data);

        } catch (err) {

            res.status(500).json({
                message: err.message
            });
        }
    },

    // ================= GET BY CÔNG TRÌNH =================
    getByCongTrinhId: async (req, res) => {

        try {

            const data =
                await SoHuuCongTrinhService.getByCongTrinhId(
                    req.params.congTrinhId
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
                await SoHuuCongTrinhService.create(
                    req.body
                );

            res.json(data);

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
                await SoHuuCongTrinhService.update(
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

    // ================= DELETE =================
    delete: async (req, res) => {

        try {

            const data =
                await SoHuuCongTrinhService.delete(
                    req.params.id
                );

            res.json(data);

        } catch (err) {

            res.status(500).json({
                message: err.message
            });
        }
    },

    // ================= TRANSFER =================
    transferOwnership: async (req, res) => {

        try {

            const data =
                await SoHuuCongTrinhService.transferOwnership(
                    req.body
                );

            res.json(data);

        } catch (err) {

            res.status(500).json({
                message: err.message
            });
        }
    }
};

module.exports = SoHuuCongTrinhController;