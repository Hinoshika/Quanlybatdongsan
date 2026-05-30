const db = require("../config/db");

const UserModel = {

    // ================= GET ALL USERS =================
    getAll: async () => {
        const sql = `
            SELECT 
                u.id,
                u.username,
                u.full_name,
                u.email,
                u.status,
                r.name AS role
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON r.id = ur.role_id
            ORDER BY u.id DESC
        `;

        const result = await db.query(sql);
        return result.rows;
    },

    // ================= CREATE USER =================
    create: async (data) => {
        const sql = `
            INSERT INTO users (
                username,
                password,
                full_name,
                email,
                status
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;

        const result = await db.query(sql, [
            data.username,
            data.password,
            data.full_name,
            data.email,
            data.status
        ]);

        return result.rows[0];
    },

    // ================= UPDATE USER =================
    update: async (id, data) => {
        const sql = `
            UPDATE users
            SET 
                full_name = $1,
                email = $2,
                status = $3
            WHERE id = $4
            RETURNING id
        `;

        const result = await db.query(sql, [
            data.full_name,
            data.email,
            data.status,
            id
        ]);

        return result.rows[0];
    },

    // ================= DELETE USER =================
    remove: async (id) => {

        await db.query(
            `DELETE FROM user_roles WHERE user_id = $1`,
            [id]
        );

        await db.query(
            `DELETE FROM users WHERE id = $1`,
            [id]
        );

        return { id };
    }
};

module.exports = UserModel;