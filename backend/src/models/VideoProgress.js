const mongoose = require("mongoose");

const videoProgressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        lastPingAt: {
            type: Date,
            default: Date.now,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Only one active progress per user per video
videoProgressSchema.index({ user: 1, video: 1 }, { unique: true });

const VideoProgress = mongoose.model("VideoProgress", videoProgressSchema);

module.exports = VideoProgress;
