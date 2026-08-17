const asyncHandler = require("../utils/asyncHandler");
const TaskSubmission = require("../models/TaskSubmission");
const Withdrawal = require("../models/withdrawal");
const User = require("../models/User");

// @desc    Get recent user activity
// @route   GET /api/activity
// @access  Private
const getRecentActivity = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const activityLimit = 10;

    // Fetch recent task submissions
    const taskSubmissions = await TaskSubmission.find({ user: userId })
        .populate("task", "title reward")
        .sort({ createdAt: -1 })
        .limit(activityLimit) // Limit initial fetch
        .lean();

    const taskActivities = taskSubmissions.map((submission) => ({
        type: "TASK_SUBMISSION",
        title: `Task: ${submission.task.title}`,
        amount: submission.status === 'approved' ? submission.task.reward : 0,
        status: submission.status,
        timestamp: submission.createdAt,
    }));

    // Fetch recent withdrawals
    const withdrawals = await Withdrawal.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(activityLimit) // Limit initial fetch
        .lean();

    const withdrawalActivities = withdrawals.map((withdrawal) => ({
        type: "WITHDRAWAL",
        title: "Withdrawal Request",
        amount: -withdrawal.amount,
        status: withdrawal.status,
        timestamp: withdrawal.createdAt,
    }));

    // Fetch recent referrals
    const referredUsers = await User.find({ referredBy: userId })
        .sort({ createdAt: -1 })
        .limit(activityLimit) // Limit initial fetch
        .lean();

    const referralActivities = referredUsers.map((user) => ({
        type: "REFERRAL",
        title: `New Referral: ${user.name}`,
        amount: 0, // No direct reward value for this event
        status: "COMPLETED",
        timestamp: user.createdAt,
    }));

    // Combine all activities
    const allActivities = [...taskActivities, ...withdrawalActivities, ...referralActivities];

    // Sort all activities by timestamp and take the latest 10
    const sortedActivities = allActivities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, activityLimit);

    res.status(200).json({
        success: true,
        data: sortedActivities,
    });
});

module.exports = {
    getRecentActivity,
};
