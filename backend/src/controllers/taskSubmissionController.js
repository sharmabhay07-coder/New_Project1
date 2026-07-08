const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const Task = require("../models/Task");
const TaskSubmission = require("../models/TaskSubmission");
const SUBMISSION_STATUS = require("../constants/submissionStatus");


const submitTask = asyncHandler(async (req, res) => {

    const {
        taskId,
        proofImage,
        submissionNote,
    } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }

    const existingSubmission = await TaskSubmission.findOne({
        task: taskId,
        user: req.user._id,
    });

    if (existingSubmission) {
        res.status(400);
        throw new Error("You have already submitted this task");
    }

    const submission = await TaskSubmission.create({
        task: taskId,
        user: req.user._id,
        proofImage,
        submissionNote,
    });

    res.status(201).json({
        success: true,
        message: "Task submitted successfully",
        data: {
            submission,
        },
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
    submitTask,
    reviewSubmission,
    getAllSubmissions,
};