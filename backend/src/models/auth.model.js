const pool = require("../config/db");

exports.findByUsername = async (username) => {
    const result = await pool.query(
        `
        SELECT 
            u.id,
            u.username,
            u.password,
            u.full_name,
            r.name AS role
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON r.id = ur.role_id
        WHERE u.username = $1
        `,
        [username]
    );

    return result.rows;
};