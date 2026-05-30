const db = require("../config/db");

const SoHuuCongTrinhModel = {

    // ================= GET ALL =================
    getAll: async () => {

        const result = await db.query(`
            SELECT
                sh.*,

                ct.ten_cong_trinh,

                csh.ho_ten,
                csh.so_cccd

            FROM so_huu_cong_trinh sh

            LEFT JOIN cong_trinh ct
                ON ct.id = sh.cong_trinh_id

            LEFT JOIN chu_so_huu csh
                ON csh.id = sh.chu_so_huu_id

            ORDER BY sh.id DESC
        `);

        return result.rows;
    },

    // ================= GET BY ID =================
    getById: async (id) => {

        const result = await db.query(`
            SELECT *
            FROM so_huu_cong_trinh
            WHERE id = $1
        `, [id]);

        return result.rows[0];
    },

    // ================= GET BY CÔNG TRÌNH =================
    getByCongTrinhId: async (congTrinhId) => {

        const result = await db.query(`
            SELECT
                sh.*,

                csh.ho_ten,
                csh.so_cccd,
                csh.so_dien_thoai

            FROM so_huu_cong_trinh sh

            LEFT JOIN chu_so_huu csh
                ON csh.id = sh.chu_so_huu_id

            WHERE sh.cong_trinh_id = $1
              AND sh.ngay_ket_thuc IS NULL

            ORDER BY sh.id DESC
        `, [congTrinhId]);

        return result.rows;
    },

    // ================= FIND OWNER =================
    findOwner: async (
        congTrinhId,
        chuSoHuuId
    ) => {

        const result = await db.query(`
            SELECT *
            FROM so_huu_cong_trinh
            WHERE cong_trinh_id = $1
              AND chu_so_huu_id = $2
              AND ngay_ket_thuc IS NULL
            LIMIT 1
        `, [
            congTrinhId,
            chuSoHuuId
        ]);

        return result.rows[0];
    },

    // ================= CREATE =================
    create: async (data) => {

        const result = await db.query(`
            INSERT INTO so_huu_cong_trinh (
                cong_trinh_id,
                chu_so_huu_id,
                ty_le_so_huu,
                ngay_bat_dau,
                ghi_chu
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [
            data.cong_trinh_id,
            data.chu_so_huu_id,
            data.ty_le_so_huu,
            data.ngay_bat_dau,
            data.ghi_chu
        ]);

        return result.rows[0];
    },

    // ================= UPDATE =================
    update: async (id, data) => {

        const result = await db.query(`
            UPDATE so_huu_cong_trinh
            SET
                ty_le_so_huu = $1,
                ngay_ket_thuc = $2,
                ghi_chu = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
        `, [
            data.ty_le_so_huu,
            data.ngay_ket_thuc,
            data.ghi_chu,
            id
        ]);

        return result.rows[0];
    },

    // ================= CLOSE OWNERSHIP =================
    closeOwnership: async (
        id,
        ngay_ket_thuc
    ) => {

        const result = await db.query(`
            UPDATE so_huu_cong_trinh
            SET
                ngay_ket_thuc = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `, [
            ngay_ket_thuc,
            id
        ]);

        return result.rows[0];
    },

    // ================= DELETE =================
    delete: async (id) => {

        await db.query(`
            DELETE FROM so_huu_cong_trinh
            WHERE id = $1
        `, [id]);

        return true;
    }
};

module.exports = SoHuuCongTrinhModel;