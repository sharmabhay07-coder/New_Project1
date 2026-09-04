const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const Task = require("../models/Task");
const TaskSubmission = require("../models/TaskSubmission");
const SUBMISSION_STATUS = require("../constants/submissionStatus");


const crypto = require("crypto");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const startTask = asyncHandler(async (req, res) => {
    const { taskId } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({ success: false, message: "Task not found" });
    }

    let submission = await TaskSubmission.findOne({ task: taskId, user: req.user._id });
    
    // Generate a unique code
    const verificationCode = "EH-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (submission) {
        if (submission.status !== SUBMISSION_STATUS.STARTED && submission.status !== SUBMISSION_STATUS.REJECTED) {
            return res.status(400).json({ success: false, message: "Task already submitted or in progress" });
        }
        submission.expectedCode = verificationCode;
        submission.codeExpiresAt = codeExpiresAt;
        submission.status = SUBMISSION_STATUS.STARTED;
        await submission.save();
    } else {
        submission = await TaskSubmission.create({
            task: taskId,
            user: req.user._id,
            status: SUBMISSION_STATUS.STARTED,
            expectedCode: verificationCode,
            codeExpiresAt,
            proofImage: "pending",
        });
    }

    res.status(200).json({
        success: true,
        message: "Task started",
        data: {
            verificationCode,
            codeExpiresAt,
        }
    });
});

const submitTask = asyncHandler(async (req, res) => {
    const { taskId, submissionNote, verificationCode } = req.body;
    const task = await Task.findById(taskId);

    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }

    const submission = await TaskSubmission.findOne({ task: taskId, user: req.user._id });
    if (!submission || submission.status !== SUBMISSION_STATUS.STARTED) {
        res.status(400);
        throw new Error("You must start the task first before submitting");
    }

    // Upload Proof
    if (!req.file) {
        res.status(400);
        throw new Error("Proof image file is required");
    }

    const cloudData = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
    if (!cloudData || !cloudData.secure_url) {
        res.status(500);
        throw new Error("Failed to upload proof image");
    }

    submission.proofImage = cloudData.secure_url;
    submission.proofHash = cloudData.phash || cloudData.etag; // Fallback to etag if phash unavailable
    submission.submissionNote = submissionNote || "";

    // Check Fraud: Verification Code
    if (!verificationCode) {
        submission.fraudStatus = "MISMATCH";
    } else if (Date.now() > submission.codeExpiresAt.getTime()) {
        submission.fraudStatus = "EXPIRED";
    } else if (verificationCode.toUpperCase() !== submission.expectedCode) {
        submission.fraudStatus = "MISMATCH";
    } else {
        submission.fraudStatus = "MATCH";
    }

    // Check Fraud: Duplicate Proof (simple exact match via etag/phash for last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const duplicate = await TaskSubmission.findOne({
        _id: { $ne: submission._id },
        proofHash: submission.proofHash,
        createdAt: { $gte: thirtyDaysAgo },
    });

    if (duplicate) {
        submission.isDuplicate = true;
        submission.duplicateOf = duplicate._id;
        submission.suspicious = true;
    }

    if (submission.fraudStatus !== "MATCH" || submission.suspicious) {
        submission.adminReviewRequired = true;
    }

    submission.status = SUBMISSION_STATUS.PENDING;
    await submission.save();

    res.status(201).json({
        success: true,
        message: "Task submitted successfully",
        data: { submission },
    });
});

const reviewSubmission = asyncHandler(async (req, res) => {

    const {
        status,
        reviewNote,
    } = req.body;

    const submission = await TaskSubmission.findById(req.params.id)
        .populate("task")
        .populate("user");

    if (!submission) {
        res.status(404);
        throw new Error("Submission not found");
    }

    if (submission.status !== SUBMISSION_STATUS.PENDING) {
        res.status(400);
        throw new Error("Submission already reviewed");
    }

    submission.status = status;
    submission.reviewNote = reviewNote || "";
    submission.reviewedBy = req.user._id;

    if (status === SUBMISSION_STATUS.APPROVED) {
        // Perform both save operations as part of a transaction
        const session = await TaskSubmission.startSession();
        session.startTransaction();
        try {
            submission.user.balance += submission.task.reward;
            await submission.user.save({ session });
            await submission.save({ session });
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
        session.endSession();
    } else {
        await submission.save();
    }

    res.status(200).json({
        success: true,
        message: "Submission reviewed successfully",
        data: {
            submission,
        },
    });
});

const getAllSubmissions = asyncHandler(async (req, res) => {

    const submissions = await TaskSubmission.find()
        .populate("task", "title reward")
        .populate("user", "name email")
        .populate("reviewedBy", "name email role")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Submissions fetched successfully",
        data: {
            submissions,
        },
    });
});

module.exports = {
    startTask,
    submitTask,
    reviewSubmission,
    getAllSubmissions,
};