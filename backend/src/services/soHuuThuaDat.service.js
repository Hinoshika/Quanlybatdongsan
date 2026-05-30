const SoHuuThuaDatModel =
    require("../models/soHuuThuaDat.model");

const SoHuuThuaDatService = {

    // ================= GET ALL =================

    getAll: async () => {

        return await SoHuuThuaDatModel.getAll();
    },

    // ================= GET BY ID =================

    getById: async (id) => {

        if (!id) {
            throw new Error("ID không hợp lệ");
        }

        return await SoHuuThuaDatModel.getById(id);
    },

    // ================= GET BY THỬA ĐẤT =================

    getByThuaDatId: async (thuaDatId) => {

        if (!thuaDatId) {
            throw new Error("Thiếu thửa đất");
        }

        return await SoHuuThuaDatModel.getByThuaDatId(
            thuaDatId
        );
    },

    // ================= CREATE =================

    create: async (data) => {

        if (
            !data.thua_dat_id ||
            !data.chu_so_huu_id
        ) {
            throw new Error(
                "Thiếu thông tin sở hữu"
            );
        }

        return await SoHuuThuaDatModel.create(data);
    },

    // ================= UPDATE =================
    update: async (id, data) => {
        const result = await SoHuuThuaDatModel.update(id, {
            ty_le_so_huu: data.ty_le_so_huu,
            updated_at: new Date()
        });

        return result;
    },

    transferOwnership: async (data) => {
        const {
            thua_dat_id,
            chu_so_huu_cu_id,
            chu_so_huu_moi_id,
            ty_le_chuyen
        } = data;

        const db = require("../config/db");

        await db.query("BEGIN");

        try {

            // ================= OLD OWNER =================
            const oldRes = await db.query(`
            SELECT *
            FROM so_huu_thua_dat
            WHERE thua_dat_id = $1
              AND chu_so_huu_id = $2
              AND ngay_ket_thuc IS NULL
        `, [thua_dat_id, chu_so_huu_cu_id]);

            const old = oldRes.rows[0];

            if (!old) throw new Error("Không tìm thấy chủ cũ");

            const newOld = Number(old.ty_le_so_huu) - Number(ty_le_chuyen);

            await db.query(`
            UPDATE so_huu_thua_dat
            SET ty_le_so_huu = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
        `, [newOld, old.id]);

            // ================= NEW OWNER =================
            const newRes = await db.query(`
            SELECT *
            FROM so_huu_thua_dat
            WHERE thua_dat_id = $1
              AND chu_so_huu_id = $2
              AND ngay_ket_thuc IS NULL
        `, [thua_dat_id, chu_so_huu_moi_id]);

            const newOwner = newRes.rows[0];

            if (newOwner) {

                await db.query(`
                UPDATE so_huu_thua_dat
                SET ty_le_so_huu = ty_le_so_huu + $1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
            `, [ty_le_chuyen, newOwner.id]);

            } else {

                await db.query(`
                INSERT INTO so_huu_thua_dat (
                    thua_dat_id,
                    chu_so_huu_id,
                    ty_le_so_huu,
                    ngay_bat_dau
                )
                VALUES ($1, $2, $3, CURRENT_DATE)
            `, [
                    thua_dat_id,
                    chu_so_huu_moi_id,
                    ty_le_chuyen
                ]);
            }

            await db.query("COMMIT");

            return { success: true };

        } catch (err) {
            await db.query("ROLLBACK");
            throw err;
        }
    },
    // ================= DELETE =================

    delete: async (id) => {

        return await SoHuuThuaDatModel.delete(id);
    }
};

module.exports = SoHuuThuaDatService;