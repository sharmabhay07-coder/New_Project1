const mongoose = require("mongoose");
const SUBMISSION_STATUS = require("../constants/submissionStatus");

const taskSubmissionSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        proofImage: {
            type: String,
            default: "",
        },

        submissionNote: {
            type: String,
            default: "",
            maxlength: 500,
        },

        status: {
            type: String,
            enum: Object.values(SUBMISSION_STATUS),
            default: SUBMISSION_STATUS.PENDING,
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        reviewNote: {
            type: String,
            default: "",
            maxlength: 500,
        },

        verificationCode: {
            type: String,
            default: "",
        },
        expectedCode: {
            type: String,
            default: "",
        },
        codeExpiresAt: {
            type: Date,
        },
        fraudStatus: {
            type: String,
            enum: ["MATCH", "MISMATCH", "EXPIRED", "PENDING", ""],
            default: "",
        },
        proofHash: {
            type: String,
            default: "",
        },
        isDuplicate: {
            type: Boolean,
            default: false,
        },
        duplicateOf: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TaskSubmission",
            default: null,
        },
        suspicious: {
            type: Boolean,
            default: false,
        },
        adminReviewRequired: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const TaskSubmission = mongoose.model(
    "TaskSubmission",
    taskSubmissionSchema
);

module.exports = TaskSubmission;
