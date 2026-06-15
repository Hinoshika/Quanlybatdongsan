const db = require("../config/db");

const ChuSoHuu = {

    // GET ALL
    getAll: async () => {
        const result = await db.query(`
        SELECT *
        FROM chu_so_huu
        WHERE deleted_at IS NULL
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
        UPDATE chu_so_huu
        SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
    `, [id]);

        return result.rows[0];
    },

    // GET TÀI SẢN THEO CHỦ SỞ HỮU
    getTaiSanByChuSoHuuId: async (chu_so_huu_id) => {
        const result = await db.query(`
        WITH dat AS (
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

                sh.ty_le_so_huu AS ty_le_so_huu_dat,
                sh.ngay_bat_dau AS ngay_bat_dau_dat,
                sh.ngay_ket_thuc AS ngay_ket_thuc_dat

            FROM so_huu_thua_dat sh
            JOIN thua_dat td 
                ON td.id = sh.thua_dat_id
            WHERE sh.chu_so_huu_id = $1
              AND td.deleted_at IS NULL
        ),

        cong_trinh_data AS (
            SELECT 
                ct.thua_dat_id,
                jsonb_build_object(
                    'id', ct.id,
                    'ten_cong_trinh', ct.ten_cong_trinh,
                    'loai_cong_trinh', ct.loai_cong_trinh,
                    'dia_chi', ct.dia_chi,
                    'dien_tich_xay_dung', ct.dien_tich_xay_dung,
                    'dien_tich_san', ct.dien_tich_san,
                    'so_tang', ct.so_tang,
                    'nam_xay_dung', ct.nam_xay_dung,
                    'trang_thai', ct.trang_thai,

                    'ty_le_so_huu', sch.ty_le_so_huu,
                    'ngay_bat_dau', sch.ngay_bat_dau,
                    'ngay_ket_thuc', sch.ngay_ket_thuc
                ) AS ct_json
            FROM cong_trinh ct
            JOIN so_huu_cong_trinh sch
                ON sch.cong_trinh_id = ct.id
                AND sch.chu_so_huu_id = $1
                AND (sch.ngay_ket_thuc IS NULL OR sch.ngay_ket_thuc > CURRENT_DATE)
        )

        SELECT 
            d.*,
            COALESCE(
                json_agg(c.ct_json) FILTER (WHERE c.ct_json IS NOT NULL),
                '[]'
            ) AS cong_trinh

        FROM dat d
        LEFT JOIN cong_trinh_data c
            ON c.thua_dat_id = d.id

        GROUP BY 
            d.id,
            d.so_thua,
            d.so_to_ban_do,
            d.loai_dat,
            d.dien_tich,
            d.trang_thai,
            d.dia_chi,
            d.tinh,
            d.geom,
            d.ty_le_so_huu_dat,
            d.ngay_bat_dau_dat,
            d.ngay_ket_thuc_dat

        ORDER BY d.id DESC
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