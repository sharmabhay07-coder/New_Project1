const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
    createVideo,
    getVideos,
    startVideoWatch,
    completeVideo,
} = require("../controllers/videoController");

const {
    getAdminVideos,
    approveVideo,
    rejectVideo,
    deleteVideo,
} = require("../controllers/adminVideoController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const ROLES = require("../constants/Roles");

const router = express.Router();

router.post(
    "/",
    protect,
    upload.single("file"),
    createVideo
);

router.get(
    "/",
    protect,
    getVideos
);

router.post(
    "/:id/start",
    protect,
    startVideoWatch
);

router.post(
    "/:id/complete",
    protect,
    completeVideo
);

// ADMIN ROUTES
router.get(
    "/admin/all",
    protect,
    authorizeRoles(ROLES.ADMIN),
    getAdminVideos
);

router.patch(
    "/admin/:id/approve",
    protect,
    authorizeRoles(ROLES.ADMIN),
    approveVideo
);

router.patch(
    "/admin/:id/reject",
    protect,
    authorizeRoles(ROLES.ADMIN),
    rejectVideo
);

router.delete(
    "/admin/:id",
    protect,
    authorizeRoles(ROLES.ADMIN),
    deleteVideo
);

module.exports = router;