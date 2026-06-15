const db = require("../config/db");

const LichSuChinhSuaModel = {

    getAll: async () => {
        const result = await db.query(`
            SELECT ls.*, u.id AS nguoi_sua_id, u.full_name AS nguoi_sua
            FROM lich_su_chinh_sua ls
            LEFT JOIN users u ON ls.nguoi_sua = u.id
            ORDER BY ls.id DESC
        `);
        return result.rows;
    },

    getById: async (id) => {
        const result = await db.query(`
            SELECT ls.*, u.id AS nguoi_sua_id, u.full_name AS nguoi_sua
            FROM lich_su_chinh_sua ls
            LEFT JOIN users u ON ls.nguoi_sua = u.id
            WHERE ls.id = $1
        `, [id]);

        return result.rows[0];
    },

    create: async (data) => {
        const result = await db.query(`
            INSERT INTO lich_su_chinh_sua (
                doi_tuong, doi_tuong_id, hanh_dong,
                du_lieu_cu, du_lieu_moi,
                nguoi_sua, ly_do
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
        `, [
            data.doi_tuong,
            data.doi_tuong_id || null,
            data.hanh_dong,
            data.du_lieu_cu,
            data.du_lieu_moi,
            data.nguoi_sua,
            data.ly_do
        ]);

        return result.rows[0];
    },

    delete: async (id) => {
        const result = await db.query(`
            DELETE FROM lich_su_chinh_sua WHERE id = $1
        `, [id]);

        return result.rowCount > 0;
    }
};

module.exports = LichSuChinhSuaModel;