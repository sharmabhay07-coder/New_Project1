const asyncHandler = require("../utils/asyncHandler");
const Video = require("../models/Video");

// 5 coins per 30 seconds (30s = 5, 60s = 10, 90s = 15...)
const calculateReward = (durationInSeconds) => {
    const blocks = Math.ceil(durationInSeconds / 30);
    return blocks * 5;
};

const createVideo = asyncHandler(async (req, res) => {

    const { title, description, thumbnail, duration } = req.body;

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Video file is required",
        });
    }

    const durationInSeconds = Number(duration) || 0;
    const reward = calculateReward(durationInSeconds);
    const videoUrl = `/uploads/videos/${req.file.filename}`;

    const video = await Video.create({
        title,
        description,
        videoUrl,
        thumbnail,
        reward,
        duration: durationInSeconds,
        uploadedBy: req.user._id,

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