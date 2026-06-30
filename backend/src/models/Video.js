const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        videoUrl: {
            type: String,
            required: true,
        },

        thumbnail: {
            type: String,
            default: "",
        },

        reward: {
            type: Number,
            required: true,
            min: 0,
        },

        duration: {
            type: Number,
            required: true,
            min: 1,
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending", 
        },
    },
    {
        timestamps: true,
    }
);

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
