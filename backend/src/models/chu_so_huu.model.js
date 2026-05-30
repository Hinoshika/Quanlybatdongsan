const db = require("../config/db");

const ChuSoHuu = {

    // GET ALL
    getAll: async () => {
        const result = await db.query(`
            SELECT *
            FROM chu_so_huu
            ORDER BY id DESC
        `);
        return result.rows;
    },

    // GET BY ID
    getById: async (id) => {
        const result = await db.query(
            `SELECT * FROM chu_so_huu WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    },

    // CREATE
    create: async (data) => {
        const {
            ho_ten,
            so_cccd,
            ngay_sinh,
            dia_chi,
            so_dien_thoai,
            loai
        } = data;

        const result = await db.query(`
            INSERT INTO chu_so_huu (
                ho_ten,
                so_cccd,
                ngay_sinh,
                dia_chi,
                so_dien_thoai,
                loai
            )
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *
        `, [
            ho_ten,
            so_cccd,
            ngay_sinh,
            dia_chi,
            so_dien_thoai,
            loai
        ]);

        return result.rows[0];
    },

    // UPDATE
    update: async (id, data) => {
        const {
            ho_ten,
            so_cccd,
            ngay_sinh,
            dia_chi,
            so_dien_thoai,
            loai
        } = data;

        const result = await db.query(`
            UPDATE chu_so_huu
            SET
                ho_ten=$1,
                so_cccd=$2,
                ngay_sinh=$3,
                dia_chi=$4,
                so_dien_thoai=$5,
                loai=$6
            WHERE id=$7
            RETURNING *
        `, [
            ho_ten,
            so_cccd,
            ngay_sinh,
            dia_chi,
            so_dien_thoai,
            loai,
            id
        ]);

        return result.rows[0];
    },

    // ❌ FIX: soft delete (không xóa thật)
    // delete: async (id) => {
    //     const result = await db.query(`
    //         UPDATE chu_so_huu
    //         SET deleted_at = NOW()
    //         WHERE id = $1
    //         RETURNING *
    //     `, [id]);

    //     return result.rows[0];
    // },

    delete: async (id) => {
        const result = await db.query(`
        DELETE FROM chu_so_huu
        WHERE id = $1
        RETURNING *
    `, [id]);

        return result.rows[0];
    },

    // GET TÀI SẢN THEO CHỦ SỞ HỮU
    getTaiSanByChuSoHuuId: async (chu_so_huu_id) => {
        const result = await db.query(`
            SELECT 
                td.id,
                td.so_thua,
                td.so_to_ban_do,
                td.loai_dat,
                td.dien_tich,
                td.trang_thai,
                td.dia_chi,
                td.tinh,
                ST_AsGeoJSON(td.geom) as geom,

                sh.ty_le_so_huu,
                sh.ngay_bat_dau,
                sh.ngay_ket_thuc

            FROM so_huu_thua_dat sh
            JOIN thua_dat td ON td.id = sh.thua_dat_id
            WHERE sh.chu_so_huu_id = $1
              AND td.deleted_at IS NULL
            ORDER BY td.id DESC
        `, [chu_so_huu_id]);

        return result.rows;
    },

    getByCCCD: async (so_cccd) => {
        const result = await db.query(`
        SELECT *
        FROM chu_so_huu
        WHERE so_cccd = $1
        LIMIT 1
    `, [so_cccd]);

        return result.rows[0];
    }
};

module.exports = ChuSoHuu;