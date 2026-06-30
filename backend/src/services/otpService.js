const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("./emailService");

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const saveOtp = async (userId) => {

    await Otp.deleteMany({
        user: userId,
        isUsed: false,
    });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(
        Date.now() + 5 * 60 * 1000
    );

    const otpRecord = await Otp.create({
        user: userId,
        otp: hashedOtp,
        expiresAt,
    });

    return { otp, otpRecord };
};

const sendOtp = async (user) => {
    const { otp, otpRecord } = await saveOtp(user._id);

    try {
        const delivery = await sendOtpEmail({
            to: user.email,
            name: user.name,
            otp,
            expiresInMinutes: 5,
        });

        return { otpRecord, delivery };
    } catch (error) {
        // Do not leave an unusable OTP or force the user to wait before retrying.
        await Otp.deleteOne({ _id: otpRecord._id });
        throw error;
    }
};

module.exports = {
    generateOtp,
    saveOtp,
    sendOtp,
};
