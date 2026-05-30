const BienDongModel = require("../models/bienDong.model");

const BienDongService = {

    // ================= GET ALL =================
    getAllBienDong: async (filters) => {
        return await BienDongModel.getAll(filters);
    },

    // ================= GET BY ID =================
    getBienDongById: async (id) => {

        if (!id) {
            throw new Error("ID biến động không hợp lệ");
        }

        return await BienDongModel.getById(id);
    },

    // ================= CREATE =================
    createBienDong: async (data) => {

        if (!data.loai_bien_dong) {
            throw new Error("Loại biến động là bắt buộc");
        }

        // ít nhất phải có thửa đất hoặc công trình
        if (
            !data.thua_dat_id &&
            !data.cong_trinh_id
        ) {
            throw new Error(
                "Phải có thửa đất hoặc công trình"
            );
        }

        // validate tỷ lệ
        if (
            data.ty_le_chuyen &&
            Number(data.ty_le_chuyen) > 100
        ) {
            throw new Error(
                "Tỷ lệ chuyển không hợp lệ"
            );
        }

        return await BienDongModel.create(data);
    },

    // ================= UPDATE =================
    updateBienDong: async (id, data) => {

        if (!id) {
            throw new Error("ID biến động không hợp lệ");
        }

        const result = await BienDongModel.update(id, data);

        if (!result) {
            throw new Error("Không tìm thấy biến động");
        }

        return result;
    },

    // ================= DELETE =================
    deleteBienDong: async (id) => {

        if (!id) {
            throw new Error("ID biến động không hợp lệ");
        }

        return await BienDongModel.delete(id);
    }
};

module.exports = BienDongService;