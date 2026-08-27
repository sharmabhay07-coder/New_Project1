const asyncHandler = require("../utils/asyncHandler");
const TaskSubmission = require("../models/TaskSubmission");
const Task = require("../models/Task");
const User = require("../models/User");
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

    const referredUsers = await User.countDocuments({
        referredBy: req.user._id,
    });

    res.status(200).json({
        success: true,
        message: "Dashboard summary fetched successfully",
        data: {
            totalBalance: req.user.balance,
            totalEarnings,
            completedTasks,
            pendingTasks,
            name: req.user.name,
            email: req.user.email,
            referralCode: req.user.referralCode || '',
            referredUsers,
        },
    });

});

const getAdminUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: {
            users,
        },
    });
});

module.exports = {
    getMySubmissions,
    getMyBalance,
    getDashboardSummary,
    getAdminUsers,
};