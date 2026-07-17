const asyncHandler = require("../utils/asyncHandler");
const Video = require("../models/Video");
const ROLES = require("../constants/Roles");

const createVideo = asyncHandler(async (req, res) => {

    const {
        title,
        description,
        videoUrl,
        thumbnail,
        reward,
        duration,
    } = req.body;

    const video = await Video.create({
        title,
        description,
        videoUrl,
        thumbnail,
        reward,
        duration,
        uploadedBy: req.user._id,

        status: req.user.role === ROLES.ADMIN
            ? "approved"
            : "pending",
    });

    res.status(201).json({
        success: true,
        message: "Video created successfully",
        data: {
            video,
        },
    });
});

const getVideos = asyncHandler(async (req, res) => {

    const videos = await Video.find({
        status: "approved",
    })
        .populate("uploadedBy", "name")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Videos fetched successfully",
        data: {
            videos,
        },
    });
});

module.exports = {
    createVideo,
    getVideos,
};
