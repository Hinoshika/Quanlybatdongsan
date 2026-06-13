const db = require("../config/db");

const YeuCauModel = {

    // ================= GET ALL =================
    getAll: async () => {
        const sql = `
            SELECT
                yc.*,
                u.full_name AS nguoi_gui
            FROM yeu_cau yc
            LEFT JOIN users u
                ON yc.nguoi_gui_id = u.id
            ORDER BY yc.id DESC
        `;

        const result = await db.query(sql);
        return result.rows;
    },

    // ================= GET BY ID =================
    getById: async (id) => {
        const sql = `
            SELECT
                yc.*,
                u.full_name AS nguoi_gui
            FROM yeu_cau yc
            LEFT JOIN users u
                ON yc.nguoi_gui_id = u.id
            WHERE yc.id = $1
        `;

        const result = await db.query(sql, [id]);
        return result.rows[0];
    },

    // ================= CREATE =================
    create: async (data) => {
        const sql = `
            INSERT INTO yeu_cau (
                nguoi_gui_id,
                loai_yeu_cau,
                noi_dung,
                trang_thai
            )
            VALUES ($1, $2, $3, 'CHO_XU_LY')
            RETURNING id
        `;

        const result = await db.query(sql, [
            data.nguoi_gui_id,
            data.loai_yeu_cau,
            data.noi_dung
        ]);

        return result.rows[0];
    },

    // ================= UPDATE =================
    update: async (id, data) => {
        const sql = `
            UPDATE yeu_cau
            SET
                trang_thai = $1,
                ghi_chu_xu_ly = $2,
                nguoi_xu_ly_id = $3,
                ngay_xu_ly = NOW()
            WHERE id = $4
            RETURNING id
        `;

        const result = await db.query(sql, [
            data.trang_thai,
            data.ghi_chu_xu_ly,
            data.nguoi_xu_ly_id,
            id
        ]);

        return result.rows[0];
    },

    // ================= DELETE =================
    remove: async (id) => {
        await db.query(
            `DELETE FROM yeu_cau WHERE id = $1`,
            [id]
        );

        return { id };
    }
};

module.exports = YeuCauModel;