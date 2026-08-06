const { body, param } = require("express-validator");
const TASK_TYPES = require("../constants/taskTypes");
const SUBMISSION_STATUS = require("../constants/submissionStatus");

const createTaskValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title must be 100 characters or fewer"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("taskType")
        .trim()
        .notEmpty()
        .withMessage("Task type is required")
        .isIn(Object.values(TASK_TYPES))
        .withMessage("Invalid task type"),

    body("reward")
        .isFloat({ min: 0 })
        .withMessage("Reward must be zero or greater"),

    body("taskLink")
        .trim()
        .notEmpty()
        .withMessage("Task link is required")
        .isURL()
        .withMessage("Task link must be a valid URL"),

    body("image")
        .optional({ values: "falsy" })
        .isURL()
        .withMessage("Image must be a valid URL"),
];

const submitTaskValidation = [
    body("taskId")
        .isMongoId()
        .withMessage("Valid Task ID is required"),
    body("proofImage")
        .notEmpty()
        .withMessage("Proof image is required")
        .isURL()
        .withMessage("Proof image must be a valid URL"),
    body("submissionNote")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 500 })
        .withMessage("Submission note must be 500 characters or fewer"),
];

const reviewSubmissionValidation = [
    param("id")
        .isMongoId()
        .withMessage("Valid submission ID is required"),
    body("status")
        .trim()
        .notEmpty()
        .withMessage("Status is required")
        .isIn(Object.values(SUBMISSION_STATUS))
        .withMessage("Invalid submission status"),
    body("reviewNote")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 500 })
        .withMessage("Review note must be 500 characters or fewer"),
];

module.exports = {
    createTaskValidation,
    submitTaskValidation,
    reviewSubmissionValidation,
};
