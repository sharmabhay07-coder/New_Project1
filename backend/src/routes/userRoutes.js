const express = require("express");
const { getMySubmissions, getMyBalance } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get(
    "/my-submissions",
    protect,
    getMySubmissions
);

router.get(
    "/my-balance",
    protect,
    getMyBalance
);
module.exports = router;
