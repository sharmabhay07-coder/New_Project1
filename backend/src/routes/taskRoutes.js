const express = require("express");
const { createTask, getAllTasks, } = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const ROLES = require("../constants/Roles");
const router = express.Router();

const validate = require("../middleware/validationMiddleware");
const { createTaskValidation } = require("../validators/taskValidator");

router.post(
    "/",
    protect,
    authorizeRoles(ROLES.ADMIN),
    createTaskValidation,
    validate,
    createTask
);

router.get(
    "/",
    protect,
    getAllTasks
);

module.exports = router;