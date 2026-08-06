const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401);
            return next(new Error("Not authorized, no token"));
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401);
            return next(new Error("Not authorized, no token"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            res.status(401);
            return next(new Error("User not found"));
        }

        return next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.status(401);
            return next(new Error("Token expired"));
        }

        if (error.name === "JsonWebTokenError") {
            res.status(401);
            return next(new Error("Invalid token"));
        }

        if (res.statusCode && res.statusCode !== 200) {
            return next(error);
        }

        res.status(500);
        return next(new Error("Server error: Could not authenticate user"));
    }
};

module.exports = protect;
