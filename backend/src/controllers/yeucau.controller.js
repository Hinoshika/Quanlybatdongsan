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
            const data = await YeuCauService.create(req.body);
            res.status(201).json(data);
        } catch (error) {
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