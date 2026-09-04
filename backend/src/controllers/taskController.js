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

const TaskSubmission = require("../models/TaskSubmission");

const getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find()
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 });

    // Fetch the logged-in user's submissions
    let userSubmissionsMap = {};
    if (req.user) {
        const userSubmissions = await TaskSubmission.find({ user: req.user._id });
        userSubmissions.forEach(sub => {
            userSubmissionsMap[sub.task.toString()] = {
                status: sub.status,
                reviewNote: sub.reviewNote
            };
        });
    }

    const tasksWithSubmissionStatus = tasks.map(task => {
        const taskObj = task.toObject();
        const submission = userSubmissionsMap[taskObj._id.toString()];
        
        taskObj.hasSubmitted = !!submission;
        if (submission) {
            taskObj.submissionStatus = submission.status;
            taskObj.reviewNote = submission.reviewNote;
        }
        return taskObj;
    });

    res.status(200).json({
        success: true,
        message: "Tasks fetched successfully",
        data: {
            tasks: tasksWithSubmissionStatus,
        },
    });
});

module.exports = {
    createTask,
    getAllTasks,
};