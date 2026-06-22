const express = require("express");

const { submitTask, reviewSubmission, getAllSubmissions, } = require("../controllers/taskSubmissionController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const ROLES = require("../constants/roles");

const router = express.Router();

router.post(
    "/",
    protect,
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
    reviewSubmission
);

module.exports = router;