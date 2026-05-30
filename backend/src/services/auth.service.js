const jwt = require("jsonwebtoken");
const AuthModel = require("../models/auth.model");

exports.login = async ({ username, password }) => {
    const rows = await AuthModel.findByUsername(username);

    if (!rows.length) throw new Error("Sai tài khoản");

    const userRows = rows;

    const roles = [...new Set(userRows.map(r => r.role).filter(Boolean))];

    const user = {
        id: userRows[0].id,
        username: userRows[0].username,
        full_name: userRows[0].full_name,
        password: userRows[0].password,
        roles
    };

    if (!user.password) throw new Error("Thiếu password");

    if (user.password.trim() !== password.trim()) {
        throw new Error("Sai mật khẩu");
    }

    const token = jwt.sign(
        {
            id: user.id,
            full_name: user.full_name,
            roles: user.roles
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        token,
        user: {
            id: user.id,
            full_name: user.full_name,
            roles: user.roles
        }
    };
};