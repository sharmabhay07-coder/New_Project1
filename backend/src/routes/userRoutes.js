const express = require("express");
const {
    getMySubmissions,
    getMyBalance,
    getDashboardSummary,
    getAdminUsers,
    updateAdminUser,
    deleteAdminUser,
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

const upload = require("../middleware/uploadMiddleware");
const { uploadProfilePicture, removeProfilePicture } = require("../controllers/userController");

router.post(
    "/upload-profile-picture",
    protect,
    upload.single("file"),
    uploadProfilePicture
);

router.delete(
    "/remove-profile-picture",
    protect,
    removeProfilePicture
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

router.patch(
    "/admin/:id",
    protect,
    authorizeRoles(ROLES.ADMIN),
    updateAdminUser
);

router.delete(
    "/admin/:id",
    protect,
    authorizeRoles(ROLES.ADMIN),
    deleteAdminUser
);
module.exports = router;
