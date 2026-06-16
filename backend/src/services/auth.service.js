const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const AuthModel = require("../models/auth.model");

// ================= LOGIN =================
exports.login = async ({ username, password }) => {

    const rows = await AuthModel.findByUsername(username);

    if (!rows.length) {
        throw new Error("Sai tài khoản");
    }

    const roles = [...new Set(rows.map(r => r.role).filter(Boolean))];

    const user = {
        id: rows[0].id,
        username: rows[0].username,
        full_name: rows[0].full_name,
        email: rows[0].email,
        password: rows[0].password,
        roles
    };

    if (user.password !== password) {
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
        { expiresIn: "1d" }
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

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (username) => {

    const user = await AuthModel.findEmailByUsername(username);

    if (!user) throw new Error("Không tìm thấy tài khoản");
    if (!user.email) throw new Error("Tài khoản chưa có email");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await AuthModel.saveOtp(user.id, otp);

    const transporter = nodemailer.createTransport({
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
        message: "Đã gửi OTP tới email"
    };
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (username, otp) => {

    const otpData = await AuthModel.verifyOtp(username, otp);

    if (!otpData) {
        throw new Error("OTP không đúng hoặc đã hết hạn");
    }

    return {
        success: true,
        message: "OTP hợp lệ"
    };
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (username, otp, newPassword) => {

    const otpData = await AuthModel.verifyOtp(username, otp);

    if (!otpData) {
        throw new Error("OTP không đúng hoặc đã hết hạn");
    }

    await AuthModel.updatePassword(
        otpData.user_id,
        newPassword
    );

    await AuthModel.markOtpUsed(otpData.id);

    return {
        success: true,
        message: "Đổi mật khẩu thành công"
    };
};