const { body } = require("express-validator");

const registerValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("mobileNumber")
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Enter a valid 10-digit mobile number"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("referralCode")
        .optional({ values: "falsy" })
        .trim()
        .toUpperCase()
        .matches(/^REF-?[A-Z0-9]{6}$/)
        .withMessage("Enter a valid referral code"),
];

const loginValidation = [
    body("identifier")
        .notEmpty()
        .withMessage(
            "Email or mobile number is required"
        ),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

const sendOtpValidation = [
    body("userId")
        .isMongoId()
        .withMessage("Valid user ID is required"),
];

const verifyOtpValidation = [
    body("userId")
        .isMongoId()
        .withMessage("Valid user ID is required"),

    body("otp")
        .matches(/^\d{6}$/)
        .withMessage("OTP must be 6 digits"),
];

module.exports = {
    registerValidation,
    loginValidation,
    sendOtpValidation,
    verifyOtpValidation,
};
