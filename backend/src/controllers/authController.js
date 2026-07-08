const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const PendingRegistration = require("../models/PendingRegistration");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const getOtpConfig = require("../config/otp");
const {
    createOtpCredentials,
    deliverRegistrationOtp,
} = require("../services/otpService");

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

const setEmailDeliveryError = (res, error) => {
    if (error.code === "EMAIL_CONFIGURATION_ERROR") {
        res.status(503);
        throw new Error("OTP email service is not configured. Please contact support");
    }

    if (error.code === "EMAIL_DELIVERY_FAILED") {
        res.status(502);
        throw new Error("OTP email could not be delivered. Please try again shortly");
    }

    throw error;
};

const createVerifiedUser = async (pendingRegistration) => {
    const maxReferralCodeAttempts = 5;

    for (let attempt = 1; attempt <= maxReferralCodeAttempts; attempt += 1) {
        const referralCode = `REF-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

        try {
            return await User.create({
                name: pendingRegistration.name,
                email: pendingRegistration.email,
                mobileNumber: pendingRegistration.mobileNumber,
                password: pendingRegistration.passwordHash,
                referralCode,
                referredBy: pendingRegistration.referredBy,
                isVerified: true,
            });
        } catch (error) {
            const referralCollision = error.code === 11000
                && Object.hasOwn(error.keyPattern || {}, "referralCode");

            if (!referralCollision || attempt === maxReferralCodeAttempts) {
                throw error;
            }
        }
    }

    throw new Error("Unable to generate a unique referral code");
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, mobileNumber, password, referralCode } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedReferralCode = referralCode?.trim().toUpperCase() || null;
    const { expiryMinutes, pendingRegistrationTtlMinutes, resendCooldownSeconds } = getOtpConfig();

    const [existingEmail, existingMobile] = await Promise.all([
        User.exists({ email: normalizedEmail }),
        User.exists({ mobileNumber }),
    ]);

    if (existingEmail) {
        res.status(409);
        throw new Error("Email already registered");
    }

    if (existingMobile) {
        res.status(409);
        throw new Error("Mobile number already registered");
    }

    let referrer = null;
    if (normalizedReferralCode) {
        referrer = await User.findOne({ referralCode: normalizedReferralCode }).select("_id");
        if (!referrer) {
            res.status(400);
            throw new Error("Invalid referral code");
        }
    }

    const [{ otp, otpHash, otpExpiresAt }, passwordHash] = await Promise.all([
        createOtpCredentials(),
        bcrypt.hash(password, 10),
    ]);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + pendingRegistrationTtlMinutes * 60 * 1000);

    const session = await PendingRegistration.startSession();
    session.startTransaction();
    let pendingRegistration;
    try {
        // A fresh attempt supersedes abandoned pending attempts for either identifier.
        await PendingRegistration.deleteMany({
            $or: [{ email: normalizedEmail }, { mobileNumber }],
        }, { session });

        pendingRegistration = await PendingRegistration.create([
            {
                name,
                email: normalizedEmail,
                mobileNumber,
                passwordHash,
                referredBy: referrer?._id || null,
                otpHash,
                otpExpiresAt,
                otpLastSentAt: now,
                expiresAt,
            },
        ], { session });
        pendingRegistration = pendingRegistration[0]; // Access the created document

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        if (error.code === 11000) {
            res.status(409);
            throw new Error("A registration is already in progress. Please try again");
        }
        throw error;
    }
    session.endSession();

    console.info(
        `[OTP] Generated registrationId=${pendingRegistration._id} expiresAt=${otpExpiresAt.toISOString()}`
    );

    try {
        await deliverRegistrationOtp({
            registrationId: pendingRegistration._id,
            email: pendingRegistration.email,
            name: pendingRegistration.name,
            otp,
        });
    } catch (error) {
        try {
            await PendingRegistration.deleteOne({ _id: pendingRegistration._id });
        } catch (cleanupError) {
            console.error(
                `[OTP] Pending registration cleanup failed registrationId=${pendingRegistration._id} message=${cleanupError.message}`
            );
        }
        console.error(
            `[OTP] Initial delivery failed registrationId=${pendingRegistration._id} code=${error.code || "unknown"}`
        );
        setEmailDeliveryError(res, error);
    }

    res.status(202).json({
        success: true,
        message: "Verification code sent. Complete verification to create your account",
        data: {
            registration: {
                id: pendingRegistration._id,
                email: pendingRegistration.email,
            },
            expiresInSeconds: expiryMinutes * 60,
            resendAfterSeconds: resendCooldownSeconds,
        },
    });
});

const sendOtpController = asyncHandler(async (req, res) => {
    const { registrationId, email } = req.body;
    const {
        expiryMinutes,
        pendingRegistrationTtlMinutes,
        resendCooldownSeconds,
        verificationLockSeconds,
    } = getOtpConfig();

    let pendingRegistration;

    if (registrationId) {
        pendingRegistration = await PendingRegistration.findById(registrationId)
            .select("+otpHash");
    } else if (email) {
        pendingRegistration = await PendingRegistration.findOne({
            email: email.trim().toLowerCase(),
            expiresAt: { $gt: new Date() },
        }).select("+otpHash");
    }

    if (!pendingRegistration || pendingRegistration.expiresAt <= new Date()) {
        res.status(410);
        throw new Error("Registration session expired. Please register again");
    }

    const activeClaimThreshold = new Date(Date.now() - verificationLockSeconds * 1000);
    if (
        pendingRegistration.verificationClaimedAt
        && pendingRegistration.verificationClaimedAt > activeClaimThreshold
    ) {
        res.status(409);
        throw new Error("Verification is already being processed. Please wait a moment");
    }

    const elapsedMilliseconds = Date.now() - pendingRegistration.otpLastSentAt.getTime();
    if (elapsedMilliseconds < resendCooldownSeconds * 1000) {
        const retryAfterSeconds = Math.max(
            1,
            resendCooldownSeconds - Math.floor(elapsedMilliseconds / 1000)
        );
        res.set("Retry-After", String(retryAfterSeconds));
        res.status(429);
        throw new Error(`Please wait ${retryAfterSeconds} seconds before requesting another OTP`);
    }

    const previousOtp = {
        otpHash: pendingRegistration.otpHash,
        otpAttempts: pendingRegistration.otpAttempts,
        otpExpiresAt: pendingRegistration.otpExpiresAt,
        otpLastSentAt: pendingRegistration.otpLastSentAt,
        verificationClaimedAt: pendingRegistration.verificationClaimedAt,
        expiresAt: pendingRegistration.expiresAt,
    };
    const { otp, otpHash, otpExpiresAt } = await createOtpCredentials();
    const now = new Date();

    pendingRegistration.otpHash = otpHash;
    pendingRegistration.otpAttempts = 0;
    pendingRegistration.otpExpiresAt = otpExpiresAt;
    pendingRegistration.otpLastSentAt = now;
    pendingRegistration.verificationClaimedAt = null;
    pendingRegistration.expiresAt = new Date(
        now.getTime() + pendingRegistrationTtlMinutes * 60 * 1000
    );
    await pendingRegistration.save();

    console.info(
        `[OTP] Regenerated registrationId=${pendingRegistration._id} expiresAt=${otpExpiresAt.toISOString()}`
    );

    try {
        await deliverRegistrationOtp({
            registrationId: pendingRegistration._id,
            email: pendingRegistration.email,
            name: pendingRegistration.name,
            otp,
        });
    } catch (error) {
        try {
            await PendingRegistration.updateOne(
                { _id: pendingRegistration._id, otpHash },
                { $set: previousOtp }
            );
        } catch (rollbackError) {
            console.error(
                `[OTP] Resend rollback failed registrationId=${registrationId} message=${rollbackError.message}`
            );
        }
        console.error(
            `[OTP] Resend delivery failed registrationId=${registrationId} code=${error.code || "unknown"}`
        );
        setEmailDeliveryError(res, error);
    }

    res.status(200).json({
        success: true,
        message: "A new verification code was sent",
        data: {
            expiresInSeconds: expiryMinutes * 60,
            resendAfterSeconds: resendCooldownSeconds,
        },
    });
});

const verifyOtpController = asyncHandler(async (req, res) => {
    const { registrationId, email, otp } = req.body;
    const { maxVerificationAttempts, verificationLockSeconds } = getOtpConfig();

    let pendingRegistration;

    if (registrationId) {
        pendingRegistration = await PendingRegistration.findById(registrationId)
            .select("+otpHash +passwordHash");
    } else if (email) {
        pendingRegistration = await PendingRegistration.findOne({
            email: email.trim().toLowerCase(),
            expiresAt: { $gt: new Date() },
        }).select("+otpHash +passwordHash");
    }

    const lookupId = registrationId || email;

    if (!pendingRegistration || pendingRegistration.expiresAt <= new Date()) {
        console.warn(`[OTP] Verification rejected lookupId=${lookupId} reason=session_expired`);
        res.status(410);
        throw new Error("Registration session expired. Please register again");
    }

    if (pendingRegistration.otpExpiresAt <= new Date()) {
        console.warn(`[OTP] Verification rejected registrationId=${pendingRegistration._id} reason=otp_expired`);
        res.status(400);
        throw new Error("OTP expired. Request a new OTP");
    }

    if (pendingRegistration.otpAttempts >= maxVerificationAttempts) {
        console.warn(`[OTP] Verification rejected registrationId=${pendingRegistration._id} reason=max_attempts`);
        res.status(429);
        throw new Error("Too many attempts. Request a new OTP");
    }

    const isOtpValid = await bcrypt.compare(otp, pendingRegistration.otpHash);
    if (!isOtpValid) {
        const updatedRegistration = await PendingRegistration.findOneAndUpdate(
            { _id: pendingRegistration._id, otpHash: pendingRegistration.otpHash },
            { $inc: { otpAttempts: 1 } },
            { new: true }
        );

        if (!updatedRegistration) {
            res.status(409);
            throw new Error("OTP changed during verification. Please use the newest OTP");
        }

        console.warn(
            `[OTP] Verification rejected registrationId=${pendingRegistration._id} reason=invalid attempts=${updatedRegistration.otpAttempts}`
        );
        res.status(updatedRegistration.otpAttempts >= maxVerificationAttempts ? 429 : 400);
        throw new Error(
            updatedRegistration.otpAttempts >= maxVerificationAttempts
                ? "Too many attempts. Request a new OTP"
                : "Invalid OTP"
        );
    }

    const claimTime = new Date();
    const staleClaimThreshold = new Date(
        claimTime.getTime() - verificationLockSeconds * 1000
    );
    const claimedRegistration = await PendingRegistration.findOneAndUpdate(
        {
            _id: pendingRegistration._id,
            otpHash: pendingRegistration.otpHash,
            otpAttempts: { $lt: maxVerificationAttempts },
            otpExpiresAt: { $gt: claimTime },
            $or: [
                { verificationClaimedAt: null },
                { verificationClaimedAt: { $lte: staleClaimThreshold } },
            ],
        },
        { $set: { verificationClaimedAt: claimTime } },
        { new: true }
    ).select("+otpHash +passwordHash");

    if (!claimedRegistration) {
        res.status(409);
        throw new Error("Verification is already being processed or the OTP was replaced");
    }

    let user = await User.findOne({
        email: claimedRegistration.email,
        mobileNumber: claimedRegistration.mobileNumber,
    });

    if (!user) {
        try {
            user = await createVerifiedUser(claimedRegistration);
        } catch (error) {
            if (error.code === 11000) {
                user = await User.findOne({
                    email: claimedRegistration.email,
                    mobileNumber: claimedRegistration.mobileNumber,
                });
            }

            if (!user) {
                await PendingRegistration.updateOne(
                    { _id: pendingRegistration._id, verificationClaimedAt: claimTime },
                    { $set: { verificationClaimedAt: null } }
                );
                console.error(
                    `[OTP] User creation failed registrationId=${pendingRegistration._id} code=${error.code || "unknown"} message=${error.message}`
                );
                res.status(error.code === 11000 ? 409 : 500);
                throw new Error(
                    error.code === 11000
                        ? "Email or mobile number was registered by another request"
                        : "Unable to complete registration"
                );
            }
        }
    }

    await PendingRegistration.deleteOne({ _id: claimedRegistration._id });
    console.info(`[OTP] Verification succeeded registrationId=${pendingRegistration._id} userId=${user._id}`);

    res.status(201).json({
        success: true,
        message: "Account created and verified successfully",
        data: buildAuthResponse(user),
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;
    const normalizedIdentifier = identifier.trim();
    const isEmail = normalizedIdentifier.includes("@");

    let user;
    if (isEmail) {
        const normalizedEmail = normalizedIdentifier.toLowerCase();
        user = await User.findOne({ email: normalizedEmail });
    } else {
        // Attempt to find by mobile number first
        user = await User.findOne({ mobileNumber: normalizedIdentifier });

        // If not found by mobile number, and it *could* be an email, try email
        // This handles cases where a mobile number might coincidentally contain '@' (though unlikely)
        // or if the user erroneously enters an email in the phone field.
        if (!user && normalizedIdentifier.includes("@")) {
            const normalizedEmail = normalizedIdentifier.toLowerCase();
            user = await User.findOne({ email: normalizedEmail });
        }
    }

    if (!user) {
        // If no user found, check for pending registrations if identifier is an email
        if (isEmail) {
            const pendingExists = await PendingRegistration.exists({
                email: normalizedIdentifier.toLowerCase(), // Use normalized email here
                expiresAt: { $gt: new Date() },
            });

            if (pendingExists) {
                res.status(403);
                throw new Error(
                    "You have a pending registration. Please check your email for the verification OTP or sign up again if it expired"
                );
            }
        }

        res.status(404);
        throw new Error("User not found");
    }

    if (!user.isVerified) {
        res.status(403);
        throw new Error("Please verify your account before logging in");
    }

    const isMatch = await bcrypt.compare(password, user.password);
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
        data: { user: req.user },
    });
});

module.exports = {
    registerUser,
    sendOtpController,
    verifyOtpController,
    loginUser,
    getMe,
};
