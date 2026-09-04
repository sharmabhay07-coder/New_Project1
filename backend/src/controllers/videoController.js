const asyncHandler = require("../utils/asyncHandler");
const Video = require("../models/Video");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// 5 coins per 30 seconds (30s = 5, 60s = 10, 90s = 15...)
const calculateReward = (durationInSeconds) => {
    const blocks = Math.ceil(durationInSeconds / 30);
    return blocks * 5;
};

const createVideo = asyncHandler(async (req, res) => {

    const { title, description, thumbnail, duration } = req.body;
    let secure_url = req.body.secure_url;
    let public_id = req.body.public_id;

    if (!secure_url || !public_id) {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Video file or Cloudinary secure_url & public_id are required",
            });
        }
        
        try {
            const cloudData = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
            if (!cloudData || !cloudData.secure_url) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload video to Cloudinary (Invalid credentials or network issue)",
                });
            }
            secure_url = cloudData.secure_url;
            public_id = cloudData.public_id;
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: `Cloudinary Error: ${error.message || error}`,
            });
        }
    }

    const durationInSeconds = Number(duration) || 0;
    const reward = calculateReward(durationInSeconds);

    const video = await Video.create({
        title,
        description,
        secure_url,
        public_id,
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

    const userCompleted = req.user && req.user.completedVideos ? req.user.completedVideos.map(id => id.toString()) : [];

    const videosWithStatus = videos.map(v => {
        const vidObj = v.toObject();
        vidObj.completed = userCompleted.includes(vidObj._id.toString());
        return vidObj;
    });

    res.status(200).json({
        success: true,
        message: "Videos fetched successfully",
        data: {
            videos: videosWithStatus,
        },
    });
});

const VideoProgress = require("../models/VideoProgress");

const startVideoWatch = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.id);
    if (!video) {
        return res.status(404).json({ success: false, message: "Video not found" });
    }

    // Check if already completed
    const user = req.user;
    if (user.completedVideos && user.completedVideos.includes(video._id)) {
        return res.status(400).json({ success: false, message: "Reward already claimed for this video" });
    }

    // Upsert progress
    let progress = await VideoProgress.findOne({ user: user._id, video: video._id });
    if (!progress) {
        progress = await VideoProgress.create({
            user: user._id,
            video: video._id,
            startedAt: Date.now(),
            lastPingAt: Date.now(),
        });
    } else {
        // Reset progress if they are starting again
        progress.startedAt = Date.now();
        progress.lastPingAt = Date.now();
        await progress.save();
    }

    res.status(200).json({ success: true, message: "Video tracking started" });
});

const completeVideo = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.id);
    if (!video) {
        return res.status(404).json({ success: false, message: "Video not found" });
    }
    
    const user = req.user;
    
    // Check if already completed
    if (user.completedVideos && user.completedVideos.includes(video._id)) {
        return res.status(400).json({ success: false, message: "Reward already claimed for this video" });
    }

    // Verify watch time (Anti-Seek Fraud)
    const progress = await VideoProgress.findOne({ user: user._id, video: video._id });
    if (!progress) {
        // user.riskLevel = "HIGH"; await user.save(); // Optionally flag user
        return res.status(400).json({ success: false, message: "Watch session not found. Please watch the video from the beginning without skipping." });
    }

    const elapsedSeconds = (Date.now() - progress.startedAt.getTime()) / 1000;
    const requiredSeconds = video.duration * 0.90; // 90% genuine watch requirement to avoid drift issues

    if (elapsedSeconds < requiredSeconds) {
        return res.status(400).json({ 
            success: false, 
            message: `Video completed too fast. Please watch the full video without skipping. Elapsed: ${Math.floor(elapsedSeconds)}s, Required: ${Math.floor(requiredSeconds)}s.` 
        });
    }

    progress.isCompleted = true;
    await progress.save();

    // Give reward to user
    user.balance += video.reward;
    if (!user.completedVideos) user.completedVideos = [];
    user.completedVideos.push(video._id);
    await user.save();

    res.status(200).json({
        success: true,
        message: "Video completed, reward added",
        reward: video.reward,
        newBalance: user.balance
    });
});

module.exports = {
    createVideo,
    getVideos,
    startVideoWatch,
    completeVideo,
};