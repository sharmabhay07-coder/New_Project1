const asyncHandler = require("../utils/asyncHandler");
const TaskSubmission = require("../models/TaskSubmission");

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

module.exports = {
    getMySubmissions,
    getMyBalance,
};