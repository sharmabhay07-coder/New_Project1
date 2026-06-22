const express = require("express");
const { createTask, getAllTasks, } = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const ROLES = require("../constants/Roles");
const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles(ROLES.ADMIN, ROLES.CLIENT),
    createTask
);

router.get(
    "/",
    protect,
    getAllTasks
);

module.exports = router;