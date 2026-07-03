const dotenv = require("dotenv");
dotenv.config();

const { sendOtpEmail, verifyEmailTransport } = require("../services/emailService");

const checkEmail = async () => {
    await verifyEmailTransport();

    const testRecipient = process.env.EMAIL_TEST_TO?.trim();

    if (!testRecipient) {
        throw new Error(
            "EMAIL_TEST_TO is missing. Add an inbox you can check to backend/.env"
        );
    }

    const info = await sendOtpEmail({
        to: testRecipient,
        name: "Email Test",
        otp: "123456",
        expiresInMinutes: 5,
    });

    console.info(
        `[EMAIL] Test message accepted messageId=${info.messageId || "unknown"}. Check the inbox and spam folder.`
    );
};

checkEmail().catch((error) => {
    console.error(`[EMAIL] Test failed: ${error.message}`);
    process.exitCode = 1;
});
