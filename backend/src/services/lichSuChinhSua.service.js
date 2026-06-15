const LichSuChinhSuaModel = require("../models/lichSuChinhSua.model");

const safeJson = (data) => {
    if (data === undefined) return null;
    if (typeof data === "string") return data;

    try {
        return JSON.stringify(data);
    } catch {
        return null;
    }
};

const LichSuChinhSuaService = {

    getAll: async () => {
        return LichSuChinhSuaModel.getAll();
    },

    getById: async (id) => {
        return LichSuChinhSuaModel.getById(id);
    },

    create: async (payload) => {
        return LichSuChinhSuaModel.create({
            ...payload,
            du_lieu_cu: safeJson(payload.du_lieu_cu),
            du_lieu_moi: safeJson(payload.du_lieu_moi)
        });
    },

    log: async ({ user, action, object, objectId, oldData, newData, reason }) => {
        return LichSuChinhSuaModel.create({
            nguoi_sua: user?.id || null,
            hanh_dong: action,
            doi_tuong: object,
            doi_tuong_id: objectId || null,
            du_lieu_cu: safeJson(oldData),
            du_lieu_moi: safeJson(newData),
            ly_do: reason || null
        });
    },

    delete: async (id) => {
        return LichSuChinhSuaModel.delete(id);
    }
};

module.exports = LichSuChinhSuaService;