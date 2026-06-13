const db = require("../config/db");

const BienDongModel = {

    // ================= GET ALL =================
    getAll: async (filters = {}) => {
        // console.log("FILTERS:", filters);
        let baseQuery = `
        SELECT
            bd.*,
            td.so_thua,
            td.so_to_ban_do,
            ct.ten_cong_trinh,
            cu.ho_ten AS chu_so_huu_cu,
            moi.ho_ten AS chu_so_huu_moi,
            u.full_name AS nguoi_tao
        FROM bien_dong bd
        LEFT JOIN thua_dat td ON bd.thua_dat_id = td.id
        LEFT JOIN cong_trinh ct ON bd.cong_trinh_id = ct.id
        LEFT JOIN chu_so_huu cu ON bd.chu_so_huu_cu_id = cu.id
        LEFT JOIN chu_so_huu moi ON bd.chu_so_huu_moi_id = moi.id
        LEFT JOIN "users" u ON bd.nguoi_tao = u.id
        WHERE 1=1
    `;

        const values = [];
        let idx = 1;

        // ================= LOẠI BIẾN ĐỘNG =================
        if (filters.loai_bien_dong) {
            baseQuery += ` AND bd.loai_bien_dong = $${idx++}`;
            values.push(filters.loai_bien_dong);
        }

        // ================= DATE FROM =================
        if (filters.from_date) {
            baseQuery += ` AND bd.ngay_bien_dong::date >= $${idx++}`;
            values.push(filters.from_date);
        }

        // ================= DATE TO =================
        if (filters.to_date) {
            baseQuery += ` AND bd.ngay_bien_dong::date <= $${idx++}`;
            values.push(filters.to_date);
        }

        // ================= MIN GIÁ TRỊ =================
        if (
            filters.min_gia_tri !== undefined &&
            filters.min_gia_tri !== null &&
            filters.min_gia_tri !== ""
        ) {
            baseQuery += `
            AND CAST(bd.gia_tri_giao_dich AS NUMERIC) >= $${idx++}
        `;
            values.push(Number(filters.min_gia_tri));
        }

        // ================= MAX GIÁ TRỊ =================
        if (
            filters.max_gia_tri !== undefined &&
            filters.max_gia_tri !== null &&
            filters.max_gia_tri !== ""
        ) {
            baseQuery += `
            AND CAST(bd.gia_tri_giao_dich AS NUMERIC) <= $${idx++}
        `;
            values.push(Number(filters.max_gia_tri));
        }

        baseQuery += ` ORDER BY bd.id DESC`;

        const result = await db.query(baseQuery, values);
        return result.rows;
    },
    // ================= GET BY ID =================
    getById: async (id) => {

        const result = await db.query(`
            SELECT
                bd.*,

                td.so_thua,
                td.so_to_ban_do,

                ct.ten_cong_trinh,

                cu.ho_ten AS chu_so_huu_cu,
                moi.ho_ten AS chu_so_huu_moi,

                u.full_name AS nguoi_tao

            FROM bien_dong bd

            LEFT JOIN thua_dat td
                ON bd.thua_dat_id = td.id

            LEFT JOIN cong_trinh ct
                ON bd.cong_trinh_id = ct.id

            LEFT JOIN chu_so_huu cu
                ON bd.chu_so_huu_cu_id = cu.id

            LEFT JOIN chu_so_huu moi
                ON bd.chu_so_huu_moi_id = moi.id

            LEFT JOIN "users" u
                ON bd.nguoi_tao = u.id

            WHERE bd.id = $1
        `, [id]);

        return result.rows[0];
    },

    // ================= CREATE =================
    create: async (data) => {

        const {
            thua_dat_id,
            cong_trinh_id,
            loai_bien_dong,
            chu_so_huu_cu_id,
            chu_so_huu_moi_id,
            ty_le_chuyen,
            gia_tri_giao_dich,
            noi_dung,
            ngay_bien_dong,
            nguoi_tao
        } = data;

        const result = await db.query(`
            INSERT INTO bien_dong (
                thua_dat_id,
                cong_trinh_id,
                loai_bien_dong,
                chu_so_huu_cu_id,
                chu_so_huu_moi_id,
                ty_le_chuyen,
                gia_tri_giao_dich,
                noi_dung,
                ngay_bien_dong,
                nguoi_tao
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *
        `, [
            thua_dat_id,
            cong_trinh_id,
            loai_bien_dong,
            chu_so_huu_cu_id,
            chu_so_huu_moi_id,
            ty_le_chuyen,
            gia_tri_giao_dich,
            noi_dung,
            ngay_bien_dong,
            nguoi_tao
        ]);

        return result.rows[0];
    },

    // ================= UPDATE =================
    update: async (id, data) => {

        const {
            thua_dat_id,
            cong_trinh_id,
            loai_bien_dong,
            chu_so_huu_cu_id,
            chu_so_huu_moi_id,
            ty_le_chuyen,
            gia_tri_giao_dich,
            noi_dung,
            ngay_bien_dong,
            nguoi_tao
        } = data;

        const result = await db.query(`
            UPDATE bien_dong SET

                thua_dat_id = $1,
                cong_trinh_id = $2,
                loai_bien_dong = $3,
                chu_so_huu_cu_id = $4,
                chu_so_huu_moi_id = $5,
                ty_le_chuyen = $6,
                gia_tri_giao_dich = $7,
                noi_dung = $8,
                ngay_bien_dong = $9,
                nguoi_tao = $10

            WHERE id = $11

            RETURNING *
        `, [
            thua_dat_id,
            cong_trinh_id,
            loai_bien_dong,
            chu_so_huu_cu_id,
            chu_so_huu_moi_id,
            ty_le_chuyen,
            gia_tri_giao_dich,
            noi_dung,
            ngay_bien_dong,
            nguoi_tao,
            id
        ]);

        return result.rows[0];
    },

    // ================= DELETE =================
    delete: async (id) => {

        const result = await db.query(`
            DELETE FROM bien_dong
            WHERE id = $1
            RETURNING *
        `, [id]);

        return result.rows[0];
    }
};

module.exports = BienDongModel;