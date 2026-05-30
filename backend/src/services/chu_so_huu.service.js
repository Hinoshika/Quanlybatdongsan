const ChuSoHuuModel = require("../models/chu_so_huu.model");

const ChuSoHuuService = {
    getAllChuSoHuu: async () => {
        return await ChuSoHuuModel.getAll();
    },

    getChuSoHuuById: async (id) => {
        return await ChuSoHuuModel.getById(id);
    },

    getTaiSanByChuSoHuuId: async (id) => {
        const existing = await ChuSoHuuModel.getById(id);
        if (!existing) {
            throw new Error("Không tìm thấy tài sản của chủ sở hữu");
        }

        return await ChuSoHuuModel.getTaiSanByChuSoHuuId(id);
    },

    getChuSoHuuByCCCD: async (so_cccd) => {
        return await ChuSoHuuModel.getByCCCD(so_cccd);
    },

    createChuSoHuu: async (data) => {
        if (!data.ho_ten) {
            throw new Error("Thiếu họ tên");
        }

        return await ChuSoHuuModel.create(data);
    },

    updateChuSoHuu: async (id, data) => {
        const existing = await ChuSoHuuModel.getById(id);
        if (!existing) {
            throw new Error("Không tìm thấy chủ sở hữu");
        }

        return await ChuSoHuuModel.update(id, data);
    },

    deleteChuSoHuu: async (id) => {
        const existing = await ChuSoHuuModel.getById(id);
        if (!existing) {
            throw new Error("Không tìm thấy chủ sở hữu");
        }

        return await ChuSoHuuModel.delete(id);
    }
};

module.exports = ChuSoHuuService;