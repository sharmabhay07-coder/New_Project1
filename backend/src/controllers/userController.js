const asyncHandler = require("../utils/asyncHandler");
const TaskSubmission = require("../models/TaskSubmission");
const Task = require("../models/Task");
const SUBMISSION_STATUS = require("../constants/submissionStatus");

const getMySubmissions = asyncHandler(async (req, res) => {

    const submissions = await TaskSubmission.find({
        user: req.user._id,
    })
        .populate("task", "title reward")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "My submissions fetched successfully",
        data: {
            submissions,
        },
    });
});

const getMyBalance = asyncHandler(async (req, res) => {

    res.status(200).json({
        success: true,
        message: "Balance fetched successfully",
        data: {
            balance: req.user.balance,
        },
    });
});

const getDashboardSummary = asyncHandler(async (req, res) => {

    const approvedSubmissions = await TaskSubmission.find({
        user: req.user._id,
        status: SUBMISSION_STATUS.APPROVED,
    }).populate("task", "reward");

    const totalEarnings = approvedSubmissions.reduce(
        (sum, submission) => {
            return sum + (submission.task?.reward || 0);
        },
        0
    );

    const completedTasks = approvedSubmissions.length;

    const pendingTasks = await TaskSubmission.countDocuments({
        user: req.user._id,
        status: SUBMISSION_STATUS.PENDING,
    });

    res.status(200).json({
        success: true,
        message: "Dashboard summary fetched successfully",
        data: {
            totalBalance: req.user.balance,
            totalEarnings,
            completedTasks,
            pendingTasks,
        },
    });

});

module.exports = {
    getMySubmissions,
    getMyBalance,
    getDashboardSummary,
};