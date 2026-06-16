const pool = require("../config/db");

exports.findByUsername = async (username) => {
    const result = await pool.query(
        `
        SELECT 
            u.id,
            u.username,
            u.password,
            u.full_name,
            u.email,
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

exports.findEmailByUsername = async (username) => {
    const result = await pool.query(
        `
        SELECT
            id,
            username,
            full_name,
            email
        FROM users
        WHERE username = $1
        `,
        [username]
    );

    return result.rows[0];
};

// ================= OTP =================

exports.saveOtp = async (userId, otp) => {

    await pool.query(
        `
        DELETE FROM password_reset_otp
        WHERE user_id = $1
        `,
        [userId]
    );

    await pool.query(
        `
        INSERT INTO password_reset_otp
        (
            user_id,
            otp,
            expires_at
        )
        VALUES
        (
            $1,
            $2,
            NOW() + INTERVAL '5 minutes'
        )
        `,
        [userId, otp]
    );
};

exports.verifyOtp = async (username, otp) => {

    const result = await pool.query(
        `
        SELECT p.*, u.id AS user_id
        FROM password_reset_otp p
        JOIN users u ON u.id = p.user_id
        WHERE u.username = $1
          AND p.otp = $2
          AND p.used = false
          AND p.expires_at > NOW()
        ORDER BY p.id DESC
        LIMIT 1
        `,
        [username, otp]
    );

    return result.rows[0];
};

exports.updatePassword = async (
    userId,
    newPassword
) => {

    await pool.query(
        `
        UPDATE users
        SET password = $1
        WHERE id = $2
        `,
        [newPassword, userId]
    );
};

exports.markOtpUsed = async (otpId) => {

    await pool.query(
        `
        UPDATE password_reset_otp
        SET used = true
        WHERE id = $1
        `,
        [otpId]
    );
};
exports.markOtpVerified = async (otpId) => {
    await pool.query(
        `
        UPDATE password_reset_otp
        SET verified = true
        WHERE id = $1
        `,
        [otpId]
    );
};