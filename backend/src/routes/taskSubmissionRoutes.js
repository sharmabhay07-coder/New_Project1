const express = require("express");

const { startTask, submitTask, reviewSubmission, getAllSubmissions, } = require("../controllers/taskSubmissionController");
const upload = require("../middleware/uploadMiddleware");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const ROLES = require("../constants/Roles");

const router = express.Router();

const validate = require("../middleware/validationMiddleware");
const {
    submitTaskValidation,
    reviewSubmissionValidation,
} = require("../validators/taskValidator");

router.post(
    "/start",
    protect,
    startTask
);

router.post(
    "/",
    protect,
    upload.single("file"),
    submitTaskValidation,
    validate,
    submitTask
);

router.get(
    "/",
    protect,
    authorizeRoles(ROLES.ADMIN, ROLES.CLIENT),
    getAllSubmissions
);

router.put(
    "/:id/review",
    protect,
    authorizeRoles(ROLES.ADMIN, ROLES.CLIENT),
    reviewSubmissionValidation,
    validate,
    reviewSubmission
);

module.exports = router;
