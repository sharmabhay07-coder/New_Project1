const asyncHandler = require("../utils/asyncHandler");
const TaskSubmission = require("../models/TaskSubmission");
const Task = require("../models/Task");
const User = require("../models/User");
const SUBMISSION_STATUS = require("../constants/submissionStatus");
const ROLES = require("../constants/Roles");

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
            profilePicture: req.user.profilePicture,
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

const updateAdminUser = asyncHandler(async (req, res) => {
    const { name, email, mobileNumber, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    if (
        req.user._id.toString() === req.params.id &&
        role &&
        role !== ROLES.ADMIN
    ) {
        return res.status(400).json({
            success: false,
            message: "You cannot change your own admin role",
        });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (mobileNumber !== undefined) user.mobileNumber = mobileNumber;
    if (role !== undefined) user.role = role;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: {
            user: updatedUser,
        },
    });
});

const deleteAdminUser = asyncHandler(async (req, res) => {
    if (req.user._id.toString() === req.params.id) {
        return res.status(400).json({
            success: false,
            message: "You cannot delete your own account",
        });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});

const { uploadOnCloudinary } = require("../utils/cloudinary");

const uploadProfilePicture = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No image file provided",
        });
    }

    try {
        const cloudData = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
        if (!cloudData || !cloudData.secure_url) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload image to Cloudinary",
            });
        }

        const user = await User.findById(req.user._id);
        user.profilePicture = cloudData.secure_url;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            data: {
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Cloudinary Error: ${error.message || error}`,
        });
    }
});

const removeProfilePicture = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.profilePicture = "";
    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile picture removed successfully",
        data: {
            profilePicture: "",
        },
    });
});

module.exports = {
    getMySubmissions,
    getMyBalance,
    getDashboardSummary,
    getAdminUsers,
    updateAdminUser,
    deleteAdminUser,
    uploadProfilePicture,
    removeProfilePicture,
};