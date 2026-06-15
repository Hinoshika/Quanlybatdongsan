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
            const err = new Error("Thiếu họ tên");
            err.status = 400;
            throw err;
        }

        if (!data.so_cccd) {
            const err = new Error("Thiếu số CCCD");
            err.status = 400;
            throw err;
        }
        if (!data.so_dien_thoai && !data.dia_chi) {
            const err = new Error("Thiếu thông tin liên lạc");
            err.status = 400;
            throw err;
        }

        if (data.so_dien_thoai && !/^\d{10,15}$/.test(data.so_dien_thoai)) {
            const err = new Error("Số điện thoại không hợp lệ");
            err.status = 400;
            throw err;
        }

        if (data.so_cccd && !/^\d{10,15}$/.test(data.so_cccd)) {
            const err = new Error("Số CCCD không hợp lệ");
            err.status = 400;
            throw err;
        }
        if (!data.loai) {
            const err = new Error("Thiếu loại chủ sở hữu");
            err.status = 400;
            throw err;
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