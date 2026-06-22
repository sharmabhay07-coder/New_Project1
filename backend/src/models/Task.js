const mongoose = require("mongoose");
const TASK_TYPES = require("../constants/taskTypes");
const TASK_STATUS = require("../constants/taskStatus");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        taskType: {
            type: String,
            enum: Object.values(TASK_TYPES),
            required: true,
        },

        reward: {
            type: Number,
            required: true,
            min: 0,
        },

        taskLink: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: Object.values(TASK_STATUS),
            default: TASK_STATUS.ACTIVE,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
