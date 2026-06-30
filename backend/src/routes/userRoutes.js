const express = require("express");
const { getMySubmissions, getMyBalance, getDashboardSummary } = require("../controllers/userController");
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

router.get(
    "/dashboard",
    protect,
    getDashboardSummary
);
module.exports = router;
