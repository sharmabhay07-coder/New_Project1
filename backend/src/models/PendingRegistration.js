const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        mobileNumber: {
            type: String,
            required: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
            select: false,
        },
        referredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        otpHash: {
            type: String,
            required: true,
            select: false,
        },
        otpAttempts: {
            type: Number,
            default: 0,
            min: 0,
        },
        otpExpiresAt: {
            type: Date,
            required: true,
        },
        otpLastSentAt: {
            type: Date,
            required: true,
        },
        verificationClaimedAt: {
            type: Date,
            default: null,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

pendingRegistrationSchema.index({ email: 1 }, { unique: true });
pendingRegistrationSchema.index({ mobileNumber: 1 }, { unique: true });
pendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PendingRegistration", pendingRegistrationSchema);
