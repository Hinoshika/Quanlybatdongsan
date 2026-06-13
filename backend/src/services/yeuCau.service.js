const YeuCauModel = require("../models/yeuCau.model");

const YeuCauService = {

    getAll: async () => {
        return await YeuCauModel.getAll();
    },

    getById: async (id) => {
        return await YeuCauModel.getById(id);
    },

    create: async (data) => {
        return await YeuCauModel.create(data);
    },

    update: async (id, data) => {
        return await YeuCauModel.update(id, data);
    },

    remove: async (id) => {
        return await YeuCauModel.remove(id);
    }
};

module.exports = YeuCauService;