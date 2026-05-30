exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const roles = req.user?.roles;

        if (!roles || !Array.isArray(roles)) {
            return res.status(403).json({ message: "No role" });
        }

        const ok = roles.some(role => allowedRoles.includes(role));

        if (!ok) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };
};