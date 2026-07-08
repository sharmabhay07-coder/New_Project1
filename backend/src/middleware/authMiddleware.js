const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                res.status(401);
                throw new Error("User not found");
            }
            next();
        } else {
            res.status(401);
            throw new Error("Not authorized, no token");
        }
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.status(401);
            throw new Error("Token expired");
        }
        if (error.name === "JsonWebTokenError") {
            res.status(401);
            throw new Error("Invalid token");
        }
        // For database or other unexpected errors
        res.status(500);
        throw new Error("Server error: Could not authenticate user");
    }
};

module.exports = protect;