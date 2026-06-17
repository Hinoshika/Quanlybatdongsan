const ChuSoHuuModel = require("../models/chu_so_huu.model");
const LichSuChinhSuaService = require("../services/lichSuChinhSua.service");

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

        const created = await ChuSoHuuModel.create(data);


        await LichSuChinhSuaService.log({
            user: data.user || { id: 1 },

            action: "CREATE",

            object: "CHU_SO_HUU",

            objectId: created.id,

            newData: created,

            reason: "Tạo chủ sở hữu mới"
        });


        return created;
    },
    updateChuSoHuu: async (id, data) => {
        const existing = await ChuSoHuuModel.getById(id);
        if (!existing) {
            throw new Error("Không tìm thấy chủ sở hữu");
        }

        const updated = await ChuSoHuuModel.update(id, data);


        await LichSuChinhSuaService.log({
            user: data.user || { id: 1 },

            action: "UPDATE",

            object: "CHU_SO_HUU",

            objectId: id,

            oldData: existing,

            newData: updated,

            reason: "Cập nhật thông tin chủ sở hữu"
        });


        return updated;
    },

    deleteChuSoHuu: async (id) => {
        const existing =
            await ChuSoHuuModel.getById(id);


        if (!existing) {
            throw new Error(
                "Không tìm thấy chủ sở hữu"
            );
        }


        const taiSan =
            await ChuSoHuuModel.checkTaiSanDangSoHuu(id);



        if (
            Number(taiSan.so_thua_dat) > 0 ||
            Number(taiSan.so_cong_trinh) > 0
        ) {

            const err = new Error(
                `Không thể xóa chủ sở hữu. 
            Hiện đang sở hữu tài sản`
            );

            err.status = 400;

            throw err;
        }

        await LichSuChinhSuaService.log({
            user: { id: 1 },

            action: "DELETE",

            object: "CHU_SO_HUU",

            objectId: id,

            oldData: existing,

            reason: "Xóa chủ sở hữu"
        });


        return deleted;
    }
};

module.exports = ChuSoHuuService;