const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendOtpEmail } = require("./emailService");
const getOtpConfig = require("../config/otp");

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

const createOtpCredentials = async () => {
    const { expiryMinutes } = getOtpConfig();
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    return { otp, otpHash, otpExpiresAt };
};

const deliverRegistrationOtp = async ({ registrationId, email, name, otp }) => {
    const { expiryMinutes } = getOtpConfig();
    const delivery = await sendOtpEmail({
        to: email,
        name,
        otp,
        expiresInMinutes: expiryMinutes,
    });

    console.info(`[OTP] Delivery accepted registrationId=${registrationId}`);
    return delivery;
};

module.exports = {
    generateOtp,
    createOtpCredentials,
    deliverRegistrationOtp,
};
