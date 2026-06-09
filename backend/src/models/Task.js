const mongoose = require("mongoose");
const TASK_TYPES = require("../constants/taskTypes");
const TASK_STATUS = require("../constants/taskStatus");

const taskSchema = new mongoose.Schema(
    {

    },
    {
        timestamps=true,
    }
);