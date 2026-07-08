const express = require("express");

const {
    createVideo,
    getVideos,
} = require("../controllers/videoController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const ROLES = require("../constants/Roles");

const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles(ROLES.ADMIN),
    createVideo
);

router.get(
    "/",
    protect,
    getVideos
);

module.exports = router;