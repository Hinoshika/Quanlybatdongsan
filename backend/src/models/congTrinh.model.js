const db = require("../config/db");

const CongTrinhModel = {

    // ================= GET ALL =================
    getAll: async () => {
        return db.query(`
            SELECT
                id,
                thua_dat_id,
                ten_cong_trinh,
                loai_cong_trinh,
                dia_chi,
                dien_tich_xay_dung,
                dien_tich_san,
                so_tang,
                ket_cau,
                cap_hang,
                nam_xay_dung,
                hinh_thuc_so_huu,
                thoi_han_so_huu,
                trang_thai,
                ST_AsGeoJSON(geom) AS geom,
                ST_Y(ST_Centroid(geom)) AS lat,
                ST_X(ST_Centroid(geom)) AS lng
            FROM cong_trinh
            WHERE deleted_at IS NULL
            ORDER BY id DESC
        `).then(res => res.rows);
    },

    // ================= GET BY ID =================
    getById: async (id) => {
        const result = await db.query(`
            SELECT
                ct.*,
                ST_AsGeoJSON(ct.geom) AS geom,

                COALESCE(
                    json_agg(DISTINCT jsonb_build_object(
                        'id', cs.id,
                        'ho_ten', cs.ho_ten,
                        'so_cccd', cs.so_cccd,
                        'ty_le_so_huu', sh.ty_le_so_huu
                    )) FILTER (WHERE cs.id IS NOT NULL),
                    '[]'
                ) AS chu_so_huu

            FROM cong_trinh ct

            LEFT JOIN so_huu_cong_trinh sh
                ON sh.cong_trinh_id = ct.id

            LEFT JOIN chu_so_huu cs
                ON cs.id = sh.chu_so_huu_id

            WHERE ct.id = $1
              AND ct.deleted_at IS NULL

            GROUP BY ct.id
        `, [id]);

        const row = result.rows[0];

        return {
            ...row,
            geom: row?.geom ? JSON.parse(row.geom) : null
        };
    },

    // ================= CREATE =================
    create: async (data) => {
        const result = await db.query(`
            INSERT INTO cong_trinh (
                thua_dat_id,
                ten_cong_trinh,
                loai_cong_trinh,
                dia_chi,
                dien_tich_xay_dung,
                dien_tich_san,
                so_tang,
                ket_cau,
                cap_hang,
                nam_xay_dung,
                hinh_thuc_so_huu,
                thoi_han_so_huu,
                trang_thai,
                geom
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,
                $7,$8,$9,$10,$11,$12,$13,
                ST_GeomFromGeoJSON($14)
            )
            RETURNING *
        `, [
            data.thua_dat_id,
            data.ten_cong_trinh,
            data.loai_cong_trinh,
            data.dia_chi,
            data.dien_tich_xay_dung,
            data.dien_tich_san,
            data.so_tang,
            data.ket_cau,
            data.cap_hang,
            data.nam_xay_dung,
            data.hinh_thuc_so_huu,
            data.thoi_han_so_huu,
            data.trang_thai || "dang_su_dung",
            data.geom
        ]);

        return result.rows[0];
    },

    // ================= UPDATE =================
    update: async (id, data) => {
        const result = await db.query(`
            UPDATE cong_trinh
            SET
                thua_dat_id = $1,
                ten_cong_trinh = $2,
                loai_cong_trinh = $3,
                dia_chi = $4,
                dien_tich_xay_dung = $5,
                dien_tich_san = $6,
                so_tang = $7,
                ket_cau = $8,
                cap_hang = $9,
                nam_xay_dung = $10,
                hinh_thuc_so_huu = $11,
                thoi_han_so_huu = $12,
                trang_thai = $13,
                geom = ST_GeomFromGeoJSON($14),
                updated_at = NOW()
            WHERE id = $15
              AND deleted_at IS NULL
            RETURNING *
        `, [
            data.thua_dat_id,
            data.ten_cong_trinh,
            data.loai_cong_trinh,
            data.dia_chi,
            data.dien_tich_xay_dung,
            data.dien_tich_san,
            data.so_tang,
            data.ket_cau,
            data.cap_hang,
            data.nam_xay_dung,
            data.hinh_thuc_so_huu,
            data.thoi_han_so_huu,
            data.trang_thai,
            data.geom,
            id
        ]);

        return result.rows[0];
    },

    // ================= DELETE (SOFT DELETE) =================
    delete: async (id) => {
        const result = await db.query(`
            UPDATE cong_trinh
            SET deleted_at = NOW()
            WHERE id = $1
              AND deleted_at IS NULL
            RETURNING *
        `, [id]);

        return result.rows[0];
    },

    // ================= SEARCH (GIỐNG THUADATMODEL STYLE) =================
    search: async (filters) => {

        const {
            keyword,
            loai_cong_trinh,
            trang_thai,
            so_cccd,
            ho_ten,
            dien_tich_min,
            dien_tich_max
        } = filters;

        let where = `WHERE ct.deleted_at IS NULL`;
        let values = [];
        let idx = 1;

        // ================= KEYWORD =================
        if (keyword) {
            where += `
                AND (
                    ct.ten_cong_trinh ILIKE $${idx}
                    OR ct.dia_chi ILIKE $${idx}
                )
            `;
            values.push(`%${keyword}%`);
            idx++;
        }

        // ================= LOẠI =================
        if (loai_cong_trinh) {
            where += ` AND ct.loai_cong_trinh = $${idx++}`;
            values.push(loai_cong_trinh);
        }

        // ================= TRẠNG THÁI =================
        if (trang_thai) {
            where += ` AND ct.trang_thai = $${idx++}`;
            values.push(trang_thai);
        }

        // ================= DIỆN TÍCH =================
        if (dien_tich_min) {
            where += ` AND ct.dien_tich_san >= $${idx++}`;
            values.push(dien_tich_min);
        }

        if (dien_tich_max) {
            where += ` AND ct.dien_tich_san <= $${idx++}`;
            values.push(dien_tich_max);
        }

        // ================= OWNER SEARCH (EXISTS) =================
        if (so_cccd || ho_ten) {
            where += ` AND EXISTS (
                SELECT 1
                FROM so_huu_cong_trinh sh
                JOIN chu_so_huu cs ON cs.id = sh.chu_so_huu_id
                WHERE sh.cong_trinh_id = ct.id
                ${so_cccd ? `AND cs.so_cccd ILIKE $${idx++}` : ""}
                ${ho_ten ? `AND cs.ho_ten ILIKE $${idx++}` : ""}
            )`;

            if (so_cccd) values.push(`%${so_cccd}%`);
            if (ho_ten) values.push(`%${ho_ten}%`);
        }

        const result = await db.query(`
            SELECT
                ct.*,
                ST_AsGeoJSON(ct.geom) AS geom,
                ST_Y(ST_Centroid(ct.geom)) AS lat,
                ST_X(ST_Centroid(ct.geom)) AS lng
            FROM cong_trinh ct
            ${where}
            ORDER BY ct.id DESC
        `, values);

        return result.rows;
    },
    // ================= SEARCH BY CCCD =================
    searchByCCCD: async (so_cccd) => {

        const result = await db.query(`
        SELECT
            ct.id,
            ct.thua_dat_id,
            ct.ten_cong_trinh,
            ct.loai_cong_trinh,
            ct.dia_chi,
            ct.dien_tich_xay_dung,
            ct.dien_tich_san,
            ct.so_tang,
            ct.ket_cau,
            ct.cap_hang,
            ct.nam_xay_dung,
            ct.hinh_thuc_so_huu,
            ct.thoi_han_so_huu,
            ct.trang_thai,

            ST_AsGeoJSON(ct.geom) AS geom,

            ST_Y(ST_Centroid(ct.geom)) AS lat,
            ST_X(ST_Centroid(ct.geom)) AS lng,


            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', cs.id,
                        'ho_ten', cs.ho_ten,
                        'so_cccd', cs.so_cccd,
                        'dia_chi', cs.dia_chi,
                        'loai', cs.loai
                    )
                )
                FILTER (WHERE cs.id IS NOT NULL),
                '[]'
            ) AS chu_so_huu


        FROM cong_trinh ct


        LEFT JOIN so_huu_cong_trinh sh
            ON sh.cong_trinh_id = ct.id


        LEFT JOIN chu_so_huu cs
            ON cs.id = sh.chu_so_huu_id


        WHERE EXISTS (

            SELECT 1

            FROM so_huu_cong_trinh sh2

            JOIN chu_so_huu cs2
                ON cs2.id = sh2.chu_so_huu_id

            WHERE sh2.cong_trinh_id = ct.id

            AND TRIM(cs2.so_cccd) = TRIM($1)

        )


        GROUP BY ct.id

        ORDER BY ct.id DESC

    `, [so_cccd]);


        return result.rows;
    },

    searchByMap: async (lat, lng, radius = 500) => {

        const result = await db.query(`
        SELECT
            t.id,
            t.ten_cong_trinh,
            t.loai_cong_trinh,
            t.dia_chi,
            t.dien_tich_xay_dung,
            t.dien_tich_san,
            t.so_tang,
            t.ket_cau,
            t.cap_hang,
            t.nam_xay_dung,
            t.hinh_thuc_so_huu,
            t.thoi_han_so_huu,
            t.trang_thai,

            ST_AsGeoJSON(t.geom) AS geom,
            ST_Y(ST_Centroid(t.geom)) AS lat,
            ST_X(ST_Centroid(t.geom)) AS lng,

            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', cs.id,
                        'ho_ten', cs.ho_ten,
                        'so_cccd', cs.so_cccd,
                        'dia_chi', cs.dia_chi,
                        'loai', cs.loai
                    )
                ) FILTER (WHERE cs.id IS NOT NULL),
                '[]'
            ) AS chu_so_huu

        FROM cong_trinh t

        LEFT JOIN so_huu_cong_trinh sh
            ON sh.cong_trinh_id = t.id
            AND sh.ngay_ket_thuc IS NULL

        LEFT JOIN chu_so_huu cs
            ON cs.id = sh.chu_so_huu_id

        WHERE ST_DWithin(
            t.geom::geography,
            ST_MakePoint($2, $1)::geography,
            $3
        )

        GROUP BY t.id

        ORDER BY t.id DESC
    `, [lat, lng, radius]);

        return result.rows;
    }
};

module.exports = CongTrinhModel;