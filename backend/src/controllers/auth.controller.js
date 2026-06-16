const authService = require("../services/auth.service");

exports.login = async (req, res) => {
    try {

        const result =
            await authService.login(
                req.body
            );

        res.json(result);

    } catch (err) {

        res.status(400).json({
            message: err.message
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {

        const { username } = req.body;

        const result =
            await authService.forgotPassword(
                username
            );

        res.json(result);

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// ================= RESET PASSWORD =================

exports.resetPassword = async (req, res) => {
    try {

        const {
            username,
            otp,
            newPassword
        } = req.body;

        const result =
            await authService.resetPassword(
                username,
                otp,
                newPassword
            );

        res.json(result);

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
    try {

        const { username, otp } = req.body;

        const result =
            await authService.verifyOtp(
                username,
                otp
            );

        res.json(result);

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};