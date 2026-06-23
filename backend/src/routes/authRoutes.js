const express = require("express");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const { registerValidation, loginValidation, sendOtpValidation, verifyOtpValidation } = require("../validators/authValidator");
const { registerUser, sendOtpController, verifyOtpController, loginUser, getMe } = require("../controllers/authController");
const authorizeRoles = require("../middleware/roleMiddleware");
const ROLES = require("../constants/roles");

const router = express.Router();


router.post("/register",
    registerValidation,
    validate,
    registerUser);

router.post(
    "/send-otp",
    sendOtpValidation,
    validate,
    sendOtpController
);

router.post(
    "/verify-otp",
    verifyOtpValidation,
    validate,
    verifyOtpController
);

router.post("/login",
    loginValidation,
    validate,
    loginUser);

router.get("/me",
    protect,
    authorizeRoles(ROLES.ADMIN),
    getMe);

module.exports = router;