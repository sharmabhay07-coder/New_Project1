const { body } = require("express-validator");

const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 100 })
        .withMessage("Name must be 100 characters or fewer"),

    body("email")
        .trim()
        .toLowerCase()
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
    body("registrationId")
        .optional()
        .isMongoId()
        .withMessage("Valid registration ID is required"),
    body("email")
        .optional()
        .trim()
        .toLowerCase()
        .isEmail()
        .withMessage("Valid email is required"),
    body().custom((_, { req }) => {
        if (!req.body.registrationId && !req.body.email) {
            throw new Error("Registration ID or email is required");
        }
        return true;
    }),
];

const verifyOtpValidation = [
    body("registrationId")
        .optional()
        .isMongoId()
        .withMessage("Valid registration ID is required"),
    body("email")
        .optional()
        .trim()
        .toLowerCase()
        .isEmail()
        .withMessage("Valid email is required"),
    body().custom((_, { req }) => {
        if (!req.body.registrationId && !req.body.email) {
            throw new Error("Registration ID or email is required");
        }
        return true;
    }),
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
