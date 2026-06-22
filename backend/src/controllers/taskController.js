const asyncHandler = require("../utils/asyncHandler");

const Task = require("../models/Task");

const createTask = asyncHandler(async (req, res) => {

    const {
        title,
        description,
        taskType,
        reward,
        taskLink,
        image,
    } = req.body;

    const task = await Task.create({
        title,
        description,
        taskType,
        reward,
        taskLink,
        image,
        createdBy: req.user._id,
    });

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: {
            task,
        },
    });
});

const getAllTasks = asyncHandler(async (req, res) => {

    const tasks = await Task.find()
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Tasks fetched successfully",
        data: {
            tasks,
        },
    });
});

module.exports = {
    createTask,
    getAllTasks,
};