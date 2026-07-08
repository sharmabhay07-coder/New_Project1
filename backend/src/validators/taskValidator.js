const { body, param } = require("express-validator");

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
        .isIn(["video", "social-media", "survey", "other"])
        .withMessage("Invalid task type"),

    body("reward")
        .isFloat({ gt: 0 })
        .withMessage("Reward must be a positive number"),

    body("taskLink")
        .optional({ values: "falsy" })
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

module.exports = {
    createTaskValidation,
    submitTaskValidation,
};
