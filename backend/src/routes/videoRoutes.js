const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
    createVideo,
    getVideos,
} = require("../controllers/videoController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    upload.single("video"),
    createVideo
);

router.get(
    "/",
    protect,
    getVideos
);

module.exports = router;