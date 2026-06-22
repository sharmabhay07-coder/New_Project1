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
            required: true,
        },

        submissionNote: {
            type: String,
            default: "",
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
