const Otp = require("../models/Otp");
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const saveOtp = async (userId) => {

    await Otp.deleteMany({
        user: userId,
        isUsed: false,
    });

    const otp = generateOtp();

    const expiresAt = new Date(
        Date.now() + 5 * 60 * 1000
    );

    const otpRecord = await Otp.create({
        user: userId,
        otp,
        expiresAt,
    });

    return otpRecord;
};

const sendOtp = async (userId) => {
    const otpRecord = await saveOtp(userId);

    console.log("=================================");
    console.log("OTP:", otpRecord.otp);
    console.log("=================================");

    return otpRecord;
};

module.exports = {
    generateOtp,
    saveOtp,
    sendOtp,
};