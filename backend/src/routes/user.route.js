const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { checkRole } = require("../middleware/role.middleware");

router.get("/", verifyToken, checkRole(["admin"]), userController.getAllUsers);

router.post("/", verifyToken, checkRole(["admin"]), userController.createUser);

router.put("/:id", verifyToken, checkRole(["admin"]), userController.updateUser);

router.delete("/:id", verifyToken, checkRole(["admin"]), userController.deleteUser);

module.exports = router;