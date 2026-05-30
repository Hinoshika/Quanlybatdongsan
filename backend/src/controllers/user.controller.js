const userService = require("../services/user.service");

exports.getAllUsers = async (req, res) => {
    try {
        const data = await userService.getAllUsers();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        console.log("📥 BODY RECEIVED:", req.body);
        const data = await userService.createUser(req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const data = await userService.updateUser(req.params.id, req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const data = await userService.deleteUser(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};