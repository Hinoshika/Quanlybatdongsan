const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    console.log("📌 TOKEN HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("📌 DECODED TOKEN:", decoded);

        req.user = decoded;

        next();
    } catch (err) {
        console.log("JWT ERROR:", err.message);
        return res.status(401).json({ message: err.message });
    }
};