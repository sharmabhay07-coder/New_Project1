const { body } = require("express-validator");

const registerValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("mobileNumber")
        .notEmpty()
        .withMessage("Mobile number is required"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

const sendOtpValidation = [
    body("userId")
        .notEmpty()
        .withMessage("User ID is required"),
];

const verifyOtpValidation = [
    body("userId")
        .notEmpty()
        .withMessage("User ID is required"),

    body("otp")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits"),
];

module.exports = {
    registerValidation,
    loginValidation,
    sendOtpValidation,
    verifyOtpValidation,
};