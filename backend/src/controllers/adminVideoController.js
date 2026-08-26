const asyncHandler = require("../utils/asyncHandler");
const Video = require("../models/Video");

const getAdminVideos = asyncHandler(async (req, res) => {
    const { status } = req.query;

    const filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
        filter.status = status;
    }

    const videos = await Video.find(filter)
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Videos fetched successfully",
        data: {
            videos,
        },
    });
});

const approveVideo = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.id);

    if (!video) {
        return res.status(404).json({
            success: false,
            message: "Video not found",
        });
    }

    video.status = "approved";
    await video.save();

    res.status(200).json({
        success: true,
        message: "Video approved",
        data: {
            video,
        },
    });
});

const rejectVideo = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.id);

    if (!video) {
        return res.status(404).json({
            success: false,
            message: "Video not found",
        });
    }

    video.status = "rejected";
    await video.save();

    res.status(200).json({
        success: true,
        message: "Video rejected",
        data: {
            video,
        },
    });
});

module.exports = {
    getAdminVideos,
    approveVideo,
    rejectVideo,
};