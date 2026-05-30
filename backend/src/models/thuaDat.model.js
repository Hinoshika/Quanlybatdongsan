const db = require("../config/db");

const ThuaDatModel = {

    // ================= GET ALL =================
    getAll: async () => {
        const result = await db.query(`
            SELECT 
                id,
                so_thua,
                so_to_ban_do,
                dia_chi,
                tinh,
                dien_tich,
                loai_dat,
                muc_dich_su_dung,
                hinh_thuc_su_dung,
                thoi_han_su_dung,
                nguon_goc_su_dung,
                trang_thai,
                ST_AsGeoJSON(geom) AS geom,
                ST_Y(ST_Centroid(geom)) AS lat,
                ST_X(ST_Centroid(geom)) AS lng
            FROM thua_dat
        `);

        return result.rows;
    },
    // ================= CREATE =================
    create: async (data) => {

        const polygon = data.polygon;

        if (!Array.isArray(polygon) || polygon.length < 3) {
            throw new Error("Polygon không hợp lệ");
        }

        const coords = polygon.map(p => [p[1], p[0]]);

        // đóng polygon
        coords.push(coords[0]);

        const geojson = {
            type: "Polygon",
            coordinates: [coords]
        };

        const result = await db.query(`
        INSERT INTO thua_dat (
            so_thua,
            so_to_ban_do,
            dia_chi,
            tinh,
            dien_tich,
            loai_dat,
            trang_thai,
            geom
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7, ST_GeomFromGeoJSON($8))
        RETURNING *
    `, [
            data.so_thua,
            data.so_to_ban_do,
            data.dia_chi,
            data.tinh,
            data.dien_tich,
            data.loai_dat,
            data.trang_thai,
            JSON.stringify(geojson)
        ]);

        return result.rows[0];
    },
    // ================= UPDATE =================
    update: async (id, data) => {

        const result = await db.query(`
        UPDATE thua_dat
        SET
            so_thua = $1,
            so_to_ban_do = $2,
            dia_chi = $3,
            tinh = $4,
            dien_tich = $5,
            loai_dat = $6,
            muc_dich_su_dung = $7,
            hinh_thuc_su_dung = $8,
            thoi_han_su_dung = $9,
            nguon_goc_su_dung = $10,
            trang_thai = $11,
            updated_at = NOW()
        WHERE id = $12
        RETURNING *
    `, [
            data.so_thua,
            data.so_to_ban_do,
            data.dia_chi,
            data.tinh,
            data.dien_tich,
            data.loai_dat,
            data.muc_dich_su_dung,
            data.hinh_thuc_su_dung,
            data.thoi_han_su_dung,
            data.nguon_goc_su_dung,
            data.trang_thai,
            id
        ]);

        return result.rows[0];
    },

    // ================= DELETE =================
    delete: async (id) => {

        await db.query(`
        UPDATE thua_dat
        SET
            deleted_at = NOW()
        WHERE id = $1
    `, [id]);

        return true;
    },

    // ================= GET BY ID =================
    getById: async (id) => {

        const result = await db.query(`
        SELECT
            t.id,
            t.so_thua,
            t.so_to_ban_do,
            t.dia_chi,
            t.tinh,
            t.dien_tich,
            t.loai_dat,
            t.muc_dich_su_dung,
            t.hinh_thuc_su_dung,
            t.thoi_han_su_dung,
            t.nguon_goc_su_dung,
            t.trang_thai,

            ST_AsGeoJSON(t.geom) AS geom,
            ST_Y(ST_Centroid(t.geom)) AS lat,
            ST_X(ST_Centroid(t.geom)) AS lng,

            /* ================= CHỦ SỞ HỮU ================= */
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', cs.id,
                        'ho_ten', cs.ho_ten,
                        'so_cccd', cs.so_cccd,
                        'ngay_sinh', cs.ngay_sinh,
                        'dia_chi', cs.dia_chi,
                        'so_dien_thoai', cs.so_dien_thoai,
                        'loai', cs.loai,
                        'so_huu_id', sh.id,
                        'ty_le_so_huu', sh.ty_le_so_huu
                    )
                ) FILTER (WHERE cs.id IS NOT NULL),
                '[]'
            ) AS chu_so_huu,

            /* ================= CÔNG TRÌNH (NEW) ================= */
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', ct.id,
                        'ten_cong_trinh', ct.ten_cong_trinh,
                        'loai_cong_trinh', ct.loai_cong_trinh,
                        'so_tang', ct.so_tang,
                        'dien_tich_xay_dung', ct.dien_tich_xay_dung,
                        'dien_tich_san', ct.dien_tich_san,
                        'nam_xay_dung', ct.nam_xay_dung
                    )
                ) FILTER (WHERE ct.id IS NOT NULL),
                '[]'
            ) AS cong_trinh

        FROM thua_dat t

        /* ================= SỞ HỮU ================= */
        LEFT JOIN so_huu_thua_dat sh
        ON sh.thua_dat_id = t.id
        AND sh.ngay_ket_thuc IS NULL
        AND sh.ty_le_so_huu > 0

        LEFT JOIN chu_so_huu cs
            ON cs.id = sh.chu_so_huu_id

        /* ================= CÔNG TRÌNH ================= */
        LEFT JOIN cong_trinh ct
            ON ct.thua_dat_id = t.id

        WHERE t.id = $1
          AND t.deleted_at IS NULL

        GROUP BY t.id
    `, [id]);

        return result.rows[0];
    },

    // ================= FILTER SEARCH (NO CCCD) =================
    search: async (filters) => {
        const {
            loai_dat,
            trang_thai,
            tinh,
            dien_tich_min,
            dien_tich_max
        } = filters;

        let where = `WHERE thua_dat.deleted_at IS NULL`;
        let values = [];
        let idx = 1;

        if (loai_dat) {
            where += ` AND loai_dat = $${idx++}`;
            values.push(loai_dat);
        }

        if (trang_thai) {
            where += ` AND trang_thai = $${idx++}`;
            values.push(trang_thai);
        }

        if (tinh) {
            where += ` AND tinh ILIKE $${idx++}`;
            values.push(`%${tinh}%`);
        }

        if (dien_tich_min) {
            where += ` AND dien_tich >= $${idx++}`;
            values.push(dien_tich_min);
        }

        if (dien_tich_max) {
            where += ` AND dien_tich <= $${idx++}`;
            values.push(dien_tich_max);
        }

        const result = await db.query(`
            SELECT
                id,
                so_thua,
                so_to_ban_do,
                dia_chi,
                tinh,
                dien_tich,
                loai_dat,
                trang_thai,
                ST_AsGeoJSON(geom) AS geom,
                ST_Y(ST_Centroid(geom)) AS lat,
                ST_X(ST_Centroid(geom)) AS lng
            FROM thua_dat
            ${where}
            ORDER BY id DESC
        `, values);

        return result.rows;
    },

    // ================= SEARCH BY CCCD =================
    searchByCCCD: async (so_cccd) => {

        const result = await db.query(`
            SELECT
                td.id,
                td.so_thua,
                td.so_to_ban_do,
                td.dia_chi,
                td.tinh,
                td.dien_tich,
                td.loai_dat,
                td.muc_dich_su_dung,
                td.hinh_thuc_su_dung,
                td.thoi_han_su_dung,
                td.nguon_goc_su_dung,
                td.trang_thai,

                ST_AsGeoJSON(td.geom) AS geom,
                ST_Y(ST_Centroid(td.geom)) AS lat,
                ST_X(ST_Centroid(td.geom)) AS lng,

                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', cs.id,
                            'ho_ten', cs.ho_ten,
                            'so_cccd', cs.so_cccd,
                            'ngay_sinh', cs.ngay_sinh,
                            'dia_chi', cs.dia_chi,
                            'so_dien_thoai', cs.so_dien_thoai,
                            'loai', cs.loai
                        )
                    ) FILTER (WHERE cs.id IS NOT NULL),
                    '[]'
                ) AS chu_so_huu

            FROM thua_dat td

            LEFT JOIN so_huu_thua_dat sh
                ON sh.thua_dat_id = td.id

            LEFT JOIN chu_so_huu cs
                ON cs.id = sh.chu_so_huu_id

            WHERE EXISTS (

                SELECT 1

                FROM so_huu_thua_dat sh2

                JOIN chu_so_huu cs2
                    ON cs2.id = sh2.chu_so_huu_id

                WHERE sh2.thua_dat_id = td.id
                AND TRIM(cs2.so_cccd) = TRIM($1)
            )

            AND td.deleted_at IS NULL

            GROUP BY td.id

            ORDER BY td.id DESC
        `, [so_cccd]);

        return result.rows;
    },

    // ================= SEARCH BY MAP (Tìm theo tọa độ) =================
    searchByMap: async (lat, lng, radius = 500) => {

        const result = await db.query(`

        SELECT
            td.id,
            td.so_thua,
            td.so_to_ban_do,
            td.dia_chi,
            td.tinh,
            td.dien_tich,
            td.loai_dat,
            td.trang_thai,
            td.muc_dich_su_dung,

            ST_AsGeoJSON(td.geom)::json AS geom,

            ST_Y(ST_Centroid(td.geom)) AS lat,
            ST_X(ST_Centroid(td.geom)) AS lng,

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
            ) AS chu_so_huu,

            ST_Distance(

                td.geom::geography,

                ST_SetSRID(
                    ST_MakePoint($2, $1),
                    4326
                )::geography

            ) AS distance

        FROM thua_dat td

        LEFT JOIN so_huu_thua_dat sh
            ON sh.thua_dat_id = td.id
           AND sh.ngay_ket_thuc IS NULL

        LEFT JOIN chu_so_huu cs
            ON cs.id = sh.chu_so_huu_id

        WHERE td.deleted_at IS NULL

          AND ST_DWithin(

                td.geom::geography,

                ST_SetSRID(
                    ST_MakePoint($2, $1),
                    4326
                )::geography,

                $3

          )

        GROUP BY td.id

        ORDER BY distance ASC

    `, [
            parseFloat(lat),
            parseFloat(lng),
            parseFloat(radius)
        ]);

        return result.rows;
    },
};

module.exports = ThuaDatModel;