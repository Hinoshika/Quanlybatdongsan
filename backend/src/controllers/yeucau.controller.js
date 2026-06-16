const YeuCauService = require("../services/yeuCau.service");

const YeuCauController = {

    getAll: async (req, res) => {
        try {
            const data = await YeuCauService.getAll();
            res.json(data);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },

    getById: async (req, res) => {
        try {
            const data = await YeuCauService.getById(req.params.id);
            res.json(data);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },

    create: async (req, res) => {
        try {

            const payload = {
                ...req.body,
                tep_dinh_kem:
                    req.files?.map(file => ({
                        ten_file: file.originalname,
                        duong_dan: file.path.replace(/\\/g, "/"),
                        loai_file: file.mimetype,
                        kich_thuoc: file.size
                    })) || []
            };

            console.log(payload);

            const data =
                await YeuCauService.create(
                    payload
                );

            res.status(201).json(data);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: error.message
            });
        }
    },
    update: async (req, res) => {
        try {
            const data = await YeuCauService.update(
                req.params.id,
                req.body
            );

            res.json(data);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },

    remove: async (req, res) => {
        try {
            const data = await YeuCauService.remove(
                req.params.id
            );

            res.json(data);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
};

module.exports = YeuCauController;