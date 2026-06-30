const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const Otp = require("../models/Otp");
const { sendOtp } = require("../services/otpService");
const crypto = require("crypto");

const buildAuthResponse = (user) => ({
    token: generateToken(user._id),
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        isVerified: user.isVerified,
    },
});

const createUniqueReferralCode = async () => {
    let referralCode;
    let exists = true;

    while (exists) {
        referralCode = `REF-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
        exists = await User.exists({ referralCode });
    }

    return referralCode;
};




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

    let referrer = null;

    if (referralCode) {
        referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });

        if (!referrer) {
            res.status(400);
            throw new Error("Invalid referral code");
        }
    }

    const generatedReferralCode = await createUniqueReferralCode();

    const user = await User.create({
        name,
        email,
        mobileNumber,
        password: hashedPassword,
        referralCode: generatedReferralCode,
        referredBy: referrer?._id || null,
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

    const latestOtp = await Otp.findOne({
        user: user._id,
    }).sort({ createdAt: -1 });

    if (latestOtp && Date.now() - latestOtp.createdAt.getTime() < 30 * 1000) {
        res.status(429);
        throw new Error("Please wait 30 seconds before requesting another OTP");
    }

    console.info(`[OTP] Email send requested userId=${user._id}`);

    try {
        await sendOtp(user);
    } catch (error) {
        if (error.code === "EMAIL_CONFIGURATION_ERROR") {
            res.status(503);
            throw new Error("OTP email service is not configured. Please contact support");
        }

        if (error.code === "EMAIL_DELIVERY_FAILED") {
            res.status(502);
            throw new Error("OTP email could not be delivered. Please try again shortly");
        }

        throw error;
    }

    res.status(200).json({
        success: true,
        message: "OTP email sent successfully",
    });

});

const verifyOtpController = asyncHandler(async (req, res) => {

    const { userId, otp } = req.body;

    const otpRecord = await Otp.findOne({
        user: userId,
        isUsed: false,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
        res.status(400);
        throw new Error("Invalid or expired OTP");
    }

    if (otpRecord.expiresAt < new Date()) {
        otpRecord.isUsed = true;
        await otpRecord.save();
        res.status(400);
        throw new Error("OTP expired");
    }

    if (otpRecord.attempts >= 5) {
        res.status(429);
        throw new Error("Too many attempts. Request a new OTP");
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);

    if (!isOtpValid) {
        otpRecord.attempts += 1;
        if (otpRecord.attempts >= 5) otpRecord.isUsed = true;
        await otpRecord.save();
        res.status(400);
        throw new Error(
            otpRecord.attempts >= 5
                ? "Too many attempts. Request a new OTP"
                : "Invalid OTP"
        );
    }

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.isVerified = true;
    await user.save();

    otpRecord.isUsed = true;
    await otpRecord.save();

    res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        data: buildAuthResponse(user),
    });

});

const loginUser = asyncHandler(async (req, res) => {

    const { identifier, password } = req.body;

    const user = await User.findOne({
        $or: [
            { email: identifier.toLowerCase() },
            { mobileNumber: identifier },
        ],
    });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (!user.isVerified) {
        res.status(403);
        throw new Error(
            "Please verify your account before logging in"
        );
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: buildAuthResponse(user),
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
    verifyOtpController,
    loginUser,
    getMe,
};
