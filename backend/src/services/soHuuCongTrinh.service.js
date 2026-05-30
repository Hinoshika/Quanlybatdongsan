const SoHuuCongTrinhModel = require("../models/soHuuCongTrinh.model");

const SoHuuCongTrinhService = {

    // ================= GET ALL =================
    getAll: async () => {

        return await SoHuuCongTrinhModel.getAll();
    },

    // ================= GET BY ID =================
    getById: async (id) => {

        const data =
            await SoHuuCongTrinhModel.getById(id);

        if (!data) {
            throw new Error(
                "Không tìm thấy sở hữu công trình"
            );
        }

        return data;
    },

    // ================= GET BY CÔNG TRÌNH =================
    getByCongTrinhId: async (congTrinhId) => {

        return await SoHuuCongTrinhModel.getByCongTrinhId(
            congTrinhId
        );
    },

    // ================= CREATE =================
    create: async (data) => {

        if (!data.cong_trinh_id) {
            throw new Error(
                "Thiếu công trình"
            );
        }

        if (!data.chu_so_huu_id) {
            throw new Error(
                "Thiếu chủ sở hữu"
            );
        }

        return await SoHuuCongTrinhModel.create(data);
    },

    // ================= UPDATE =================
    update: async (id, data) => {

        const old =
            await SoHuuCongTrinhModel.getById(id);

        if (!old) {
            throw new Error(
                "Không tìm thấy dữ liệu sở hữu"
            );
        }

        return await SoHuuCongTrinhModel.update(
            id,
            data
        );
    },

    // ================= DELETE =================
    delete: async (id) => {

        const old =
            await SoHuuCongTrinhModel.getById(id);

        if (!old) {
            throw new Error(
                "Không tìm thấy dữ liệu sở hữu"
            );
        }

        return await SoHuuCongTrinhModel.delete(id);
    },

    // ================= CLOSE OWNERSHIP =================
    closeOwnership: async (
        id,
        ngay_ket_thuc
    ) => {

        const old =
            await SoHuuCongTrinhModel.getById(id);

        if (!old) {
            throw new Error(
                "Không tìm thấy dữ liệu sở hữu"
            );
        }

        return await SoHuuCongTrinhModel.closeOwnership(
            id,
            ngay_ket_thuc
        );
    },

    // ================= CHUYỂN NHƯỢNG =================
    transferOwnership: async (data) => {

        const oldOwner =
            await SoHuuCongTrinhModel.findOwner(
                data.cong_trinh_id,
                data.chu_so_huu_cu_id
            );

        if (!oldOwner) {
            throw new Error(
                "Không tìm thấy chủ sở hữu cũ"
            );
        }

        const oldRate =
            Number(oldOwner.ty_le_so_huu);

        const transferRate =
            Number(data.ty_le_chuyen);

        if (transferRate <= 0) {
            throw new Error(
                "Tỷ lệ chuyển không hợp lệ"
            );
        }

        if (transferRate > oldRate) {
            throw new Error(
                "Tỷ lệ chuyển vượt quá hiện tại"
            );
        }

        // ================= GIẢM CHỦ CŨ =================
        const remainRate =
            oldRate - transferRate;

        if (remainRate <= 0) {

            await SoHuuCongTrinhModel.update(
                oldOwner.id,
                {
                    ty_le_so_huu: 0,
                    ngay_ket_thuc:
                        data.ngay_bien_dong
                        || new Date(),
                    ghi_chu:
                        data.ghi_chu || null
                }
            );

        } else {

            await SoHuuCongTrinhModel.update(
                oldOwner.id,
                {
                    ty_le_so_huu: remainRate,
                    ghi_chu:
                        data.ghi_chu || null
                }
            );
        }

        // ================= CHỦ MỚI =================
        const newOwner =
            await SoHuuCongTrinhModel.findOwner(
                data.cong_trinh_id,
                data.chu_so_huu_moi_id
            );

        if (newOwner) {

            await SoHuuCongTrinhModel.update(
                newOwner.id,
                {
                    ty_le_so_huu:
                        Number(newOwner.ty_le_so_huu)
                        + transferRate
                }
            );

        } else {

            await SoHuuCongTrinhModel.create({
                cong_trinh_id:
                    data.cong_trinh_id,

                chu_so_huu_id:
                    data.chu_so_huu_moi_id,

                ty_le_so_huu:
                    transferRate,

                ngay_bat_dau:
                    data.ngay_bien_dong
                    || new Date(),

                ghi_chu:
                    data.ghi_chu || null
            });
        }

        return {
            success: true,
            message:
                "Chuyển nhượng thành công"
        };
    }
};

module.exports = SoHuuCongTrinhService;