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
        WHERE deleted_at IS NULL   -- 🔥 THÊM DÒNG NÀY
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
    // ================= CHECK OVERLAP =================
    checkOverlap: async (polygon, excludeId = null) => {

        const coords = polygon.map(p => [p[1], p[0]]);
        coords.push(coords[0]);

        const geojson = {
            type: "Polygon",
            coordinates: [coords]
        };

        let sql = `
        SELECT id, so_thua, so_to_ban_do
        FROM thua_dat
        WHERE deleted_at IS NULL
        AND ST_Intersects(
            geom,
            ST_GeomFromGeoJSON($1)
        )
        AND NOT ST_Touches(
            geom,
            ST_GeomFromGeoJSON($1)
        )
    `;

        const params = [JSON.stringify(geojson)];

        if (excludeId) {
            sql += ` AND id <> $2`;
            params.push(excludeId);
        }

        const result = await db.query(sql, params);
        return result.rows;
    },
    merge: async (thuaIds) => {
        const client = await db.connect();

        try {
            await client.query("BEGIN");

            // ================= GET THỬA =================
            const oldResult = await client.query(`
            SELECT *
            FROM thua_dat
            WHERE id = ANY($1)
              AND deleted_at IS NULL
        `, [thuaIds]);

            const thuas = oldResult.rows;

            if (thuas.length < 2) {
                throw new Error("Phải chọn ít nhất 2 thửa");
            }

            // ================= VALID =================
            const base = thuas[0];

            if (thuas.some(t => t.so_to_ban_do !== base.so_to_ban_do))
                throw new Error("Các thửa phải cùng tờ bản đồ");

            if (thuas.some(t => t.loai_dat !== base.loai_dat))
                throw new Error("Các thửa phải cùng loại đất");

            if (thuas.some(t => t.muc_dich_su_dung !== base.muc_dich_su_dung))
                throw new Error("Các thửa phải cùng mục đích sử dụng");

            if (thuas.some(t => t.hinh_thuc_su_dung !== "Sử Dụng Riêng"))
                throw new Error("Chỉ được gộp thửa sử dụng riêng");

            if (thuas.some(t => t.trang_thai !== "Đang sử dụng"))
                throw new Error("Chỉ được gộp thửa đang sử dụng");

            // ================= TỔNG DIỆN TÍCH =================
            const tongDienTich = thuas.reduce(
                (s, t) => s + Number(t.dien_tich || 0),
                0
            );

            // ================= MERGE GEOM =================
            const geomResult = await client.query(`
            SELECT ST_AsGeoJSON(ST_Union(geom))::json AS geom
            FROM thua_dat
            WHERE id = ANY($1)
        `, [thuaIds]);

            const geom = geomResult.rows[0].geom;

            // ================= SỐ THỬA MỚI =================
            const maxResult = await client.query(`
            SELECT COALESCE(MAX(CAST(so_thua AS INTEGER)),0) + 1 AS so_thua
            FROM thua_dat
            WHERE so_thua ~ '^[0-9]+$'
        `);

            const soThuaMoi = maxResult.rows[0].so_thua;

            // ================= INSERT THỬA MỚI =================
            const insertResult = await client.query(`
            INSERT INTO thua_dat (
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
                geom
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                'dang_su_dung',
                ST_GeomFromGeoJSON($11)
            )
            RETURNING *
        `, [
                soThuaMoi,
                base.so_to_ban_do,
                base.dia_chi,
                base.tinh,
                tongDienTich,
                base.loai_dat,
                base.muc_dich_su_dung,
                base.hinh_thuc_su_dung,
                base.thoi_han_su_dung,
                base.nguon_goc_su_dung,
                geom
            ]);

            const newThua = insertResult.rows[0];

            // =========================================================
            // 🧠 FIX QUAN TRỌNG: TRÁNH DUPLICATE CHỦ SỞ HỮU
            // =========================================================

            // 1. lấy danh sách owner UNIQUE từ tất cả thửa cũ
            const ownersRes = await client.query(`
            SELECT DISTINCT chu_so_huu_id, ty_le_so_huu
            FROM so_huu_thua_dat
            WHERE thua_dat_id = ANY($1)
        `, [thuaIds]);

            // 2. xoá toàn bộ quan hệ cũ
            await client.query(`
            DELETE FROM so_huu_thua_dat
            WHERE thua_dat_id = ANY($1)
        `, [thuaIds]);

            // 3. insert lại vào thửa mới (KHÔNG DUPLICATE)
            for (const o of ownersRes.rows) {
                await client.query(`
                INSERT INTO so_huu_thua_dat (
                    thua_dat_id,
                    chu_so_huu_id,
                    ty_le_so_huu
                )
                VALUES ($1,$2,$3)
            `, [newThua.id, o.chu_so_huu_id, o.ty_le_so_huu]);
            }

            // =========================================================
            // 🧠 CONG TRÌNH (CHUYỂN 1 LẦN DUY NHẤT)
            // =========================================================

            await client.query(`
            UPDATE cong_trinh
            SET thua_dat_id = $1
            WHERE thua_dat_id = ANY($2)
        `, [newThua.id, thuaIds]);

            // ================= MARK OLD =================
            await client.query(`
            UPDATE thua_dat
            SET deleted_at = NOW(),
                trang_thai = 'da_gop'
            WHERE id = ANY($1)
        `, [thuaIds]);

            await client.query("COMMIT");

            return newThua;

        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    },
    // ================= GET BY IDS =================
    getByIds: async (thuaIds) => {

        const result = await db.query(`
        SELECT *
        FROM thua_dat
        WHERE id = ANY($1)
        AND deleted_at IS NULL
    `, [thuaIds]);

        return result.rows;
    },

    // ================= KIỂM TRA LIỀN KỀ =================
    checkAdjacent: async (thuaIds) => {

        const result = await db.query(`
        SELECT COUNT(*)::int AS total
        FROM (
            SELECT
                a.id,
                b.id
            FROM thua_dat a
            JOIN thua_dat b
                ON a.id < b.id
            WHERE
                a.id = ANY($1)
                AND b.id = ANY($1)
                AND ST_Touches(a.geom, b.geom)
        ) x
    `, [thuaIds]);

        return (
            result.rows[0].total >=
            thuaIds.length - 1
        );
    },
    // ================= TÁCH THỬA =================
    tach: async ({ thua_dat_id, thua_con }) => {

        const client = await db.connect();

        try {

            await client.query("BEGIN");

            const oldResult = await client.query(`
            SELECT *
            FROM thua_dat
            WHERE id = $1
            AND deleted_at IS NULL
        `, [thua_dat_id]);

            const oldThua = oldResult.rows[0];

            if (!oldThua) {
                throw new Error("Không tìm thấy thửa đất");
            }

            // tạo các thửa mới
            const created = [];

            for (const item of thua_con) {

                const coords = item.coordinates.map(p => [p[0], p[1]]);

                coords.push(coords[0]);

                const geojson = {
                    type: "Polygon",
                    coordinates: [coords]
                };

                const result = await client.query(`
                INSERT INTO thua_dat (
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
                    geom
                )
                VALUES (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                    'Đang sử dụng',
                    ST_GeomFromGeoJSON($11)
                )
                RETURNING *
            `, [
                    item.so_thua_moi,
                    oldThua.so_to_ban_do,
                    oldThua.dia_chi,
                    oldThua.tinh,
                    item.dien_tich,
                    oldThua.loai_dat,
                    oldThua.muc_dich_su_dung,
                    oldThua.hinh_thuc_su_dung,
                    oldThua.thoi_han_su_dung,
                    oldThua.nguon_goc_su_dung,
                    JSON.stringify(geojson)
                ]);

                created.push(result.rows[0]);
            }

            // copy chủ sở hữu
            const owners = await client.query(`
            SELECT *
            FROM so_huu_thua_dat
            WHERE thua_dat_id = $1
        `, [thua_dat_id]);

            for (const thua of created) {

                for (const owner of owners.rows) {

                    await client.query(`
                    INSERT INTO so_huu_thua_dat (
                        thua_dat_id,
                        chu_so_huu_id,
                        ty_le_so_huu
                    )
                    VALUES ($1,$2,$3)
                `, [
                        thua.id,
                        owner.chu_so_huu_id,
                        owner.ty_le_so_huu
                    ]);
                }
            }

            // chuyển công trình sang thửa đầu tiên
            await client.query(`
            UPDATE cong_trinh
            SET thua_dat_id = $1
            WHERE thua_dat_id = $2
        `, [
                created[0].id,
                thua_dat_id
            ]);

            // đánh dấu thửa cũ
            await client.query(`
            UPDATE thua_dat
            SET
                deleted_at = NOW(),
                trang_thai = 'Đã tách'
            WHERE id = $1
        `, [thua_dat_id]);

            await client.query("COMMIT");

            return created;

        } catch (err) {

            await client.query("ROLLBACK");

            throw err;

        } finally {

            client.release();
        }
    },
};

module.exports = ThuaDatModel;