const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const Otp = require("../models/Otp");
const { sendOtp } = require("../services/otpService");




const registerUser = asyncHandler(async (req, res) => {

    const {
        name,
        email,
        mobileNumber,
        password,
        referralCode,
    } = req.body;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
        res.status(400);
        throw new Error("Email already registered");
    }

    const existingMobile = await User.findOne({
        mobileNumber,
    });

    if (existingMobile) {
        res.status(400);
        throw new Error("Mobile number already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const generatedReferralCode =
        `REF${Date.now().toString().slice(-6)}`;

    const user = await User.create({
        name,
        email,
        mobileNumber,
        password: hashedPassword,
        referralCode: generatedReferralCode,
        isVerified: false,
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                role: user.role,
                isVerified: user.isVerified,
                referralCode: user.referralCode,
            },
        },
    });

});

const sendOtpController = asyncHandler(async (req, res) => {

    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (user.isVerified) {
        res.status(400);
        throw new Error("User already verified");
    }

    await sendOtp(user._id);

    res.status(200).json({
        success: true,
        message: "OTP sent successfully",
    });

});

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        },
    });

});

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Protected route accessed",
        data: {
            user: req.user,
        },
    });
});


module.exports = {
    registerUser,
    sendOtpController,
    loginUser,
    getMe,
};