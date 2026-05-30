const db = require("../config/db");

const SoHuuThuaDatModel = {

    // ================= GET ALL =================
    getAll: async () => {
        const result = await db.query(`
            SELECT 
                sh.id,
                sh.thua_dat_id,
                sh.chu_so_huu_id,
                sh.ty_le_so_huu,
                sh.ngay_bat_dau,
                sh.ngay_ket_thuc,
                sh.ghi_chu,
                sh.created_at,
                sh.updated_at,

                td.so_thua,
                td.so_to_ban_do,

                csh.id AS owner_id,
                csh.ho_ten,
                csh.so_cccd

            FROM so_huu_thua_dat sh

            LEFT JOIN thua_dat td
                ON td.id = sh.thua_dat_id

            LEFT JOIN chu_so_huu csh
                ON csh.id = sh.chu_so_huu_id

            ORDER BY sh.id DESC
        `);

        return result.rows;
    },

    // ================= GET BY ID =================
    getById: async (id) => {
        const result = await db.query(`
            SELECT 
                sh.*,
                csh.ho_ten,
                csh.so_cccd
            FROM so_huu_thua_dat sh
            LEFT JOIN chu_so_huu csh
                ON csh.id = sh.chu_so_huu_id
            WHERE sh.id = $1
        `, [id]);

        return result.rows[0];
    },

    // ================= GET BY THỬA ĐẤT =================
    getByThuaDatId: async (thuaDatId) => {
        const result = await db.query(`
        SELECT 
            sh.id AS ownership_id,
            sh.thua_dat_id,
            sh.chu_so_huu_id,
            sh.ty_le_so_huu,
            sh.ngay_bat_dau,
            sh.ngay_ket_thuc,

            csh.id AS owner_id,
            csh.ho_ten,
            csh.so_cccd

        FROM so_huu_thua_dat sh

        LEFT JOIN chu_so_huu csh
            ON csh.id = sh.chu_so_huu_id

        WHERE sh.thua_dat_id = $1
          AND sh.ngay_ket_thuc IS NULL

        ORDER BY sh.id DESC
    `, [thuaDatId]);

        return result.rows;
    },

    // ================= CREATE =================
    create: async (data) => {
        const result = await db.query(`
            INSERT INTO so_huu_thua_dat (
                thua_dat_id,
                chu_so_huu_id,
                ty_le_so_huu,
                ngay_bat_dau,
                ghi_chu
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [
            data.thua_dat_id,
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
            UPDATE so_huu_thua_dat 
            SET 
                ty_le_so_huu = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `, [
            data.ty_le_so_huu,
            id
        ]);

        return result.rows[0];
    },

    // ================= CLOSE OWNERSHIP =================
    closeOwnership: async (id, ngay_ket_thuc) => {
        const result = await db.query(`
            UPDATE so_huu_thua_dat 
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
            DELETE FROM so_huu_thua_dat 
            WHERE id = $1
        `, [id]);

        return true;
    }
};

module.exports = SoHuuThuaDatModel;