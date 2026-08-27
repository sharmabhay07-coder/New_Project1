const express = require("express");
const {
    getMySubmissions,
    getMyBalance,
    getDashboardSummary,
    getAdminUsers,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const ROLES = require("../constants/Roles");
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

router.get(
    "/admin/all",
    protect,
    authorizeRoles(ROLES.ADMIN),
    getAdminUsers
);
module.exports = router;
