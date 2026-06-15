const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const AuthModel = require("../models/auth.model");

exports.login = async ({ username, password }) => {

    const rows =
        await AuthModel.findByUsername(
            username
        );

    if (!rows.length) {
        throw new Error("Sai tài khoản");
    }

    const roles = [
        ...new Set(
            rows
                .map(r => r.role)
                .filter(Boolean)
        )
    ];

    const user = {
        id: rows[0].id,
        username: rows[0].username,
        full_name: rows[0].full_name,
        email: rows[0].email,
        password: rows[0].password,
        roles
    };

    if (!user.password) {
        throw new Error("Thiếu password");
    }

    if (
        user.password.trim() !==
        password.trim()
    ) {
        throw new Error("Sai mật khẩu");
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            roles: user.roles
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            roles: user.roles
        }
    };
};
exports.forgotPassword = async (username) => {

    const user =
        await AuthModel.findEmailByUsername(
            username
        );

    if (!user) {
        throw new Error(
            "Không tìm thấy tài khoản"
        );
    }

    if (!user.email) {
        throw new Error(
            "Tài khoản chưa có email"
        );
    }

    const otp =
        Math.floor(
            100000 + Math.random() * 900000
        ).toString();

    const transporter =
        nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Khôi phục mật khẩu",
        html: `
            <h2>Xin chào ${user.full_name}</h2>
            <p>Mã OTP của bạn là:</p>
            <h1 style="color:#1677ff">${otp}</h1>
            <p>Mã có hiệu lực 5 phút.</p>
        `
    });

    return {
        success: true,
        message: "Đã gửi OTP tới email",
        email: user.email
    };
};