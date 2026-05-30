const userModel = require("../models/user.model");

// GET ALL USERS
exports.getAllUsers = async () => {
    return await userModel.getAll();
};

// CREATE USER + ROLE
exports.createUser = async (data) => {
    return await userModel.create(data);
};

// UPDATE USER
exports.updateUser = async (id, data) => {
    return await userModel.update(id, data);
};

// DELETE USER
exports.deleteUser = async (id) => {
    return await userModel.remove(id);
};