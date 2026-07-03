const readPositiveInteger = (name, defaultValue) => {
    const rawValue = process.env[name];

    if (rawValue === undefined || rawValue.trim() === "") {
        return defaultValue;
    }

    const value = Number(rawValue);
    if (!Number.isSafeInteger(value) || value <= 0) {
        throw new Error(`${name} must be a positive integer`);
    }

    return value;
};

const getOtpConfig = () => {
    const expiryMinutes = readPositiveInteger("OTP_EXPIRY_MINUTES", 5);
    const pendingRegistrationTtlMinutes = readPositiveInteger(
        "PENDING_REGISTRATION_TTL_MINUTES",
        30
    );

    if (pendingRegistrationTtlMinutes <= expiryMinutes) {
        throw new Error(
            "PENDING_REGISTRATION_TTL_MINUTES must be greater than OTP_EXPIRY_MINUTES"
        );
    }

    return {
        expiryMinutes,
        pendingRegistrationTtlMinutes,
        resendCooldownSeconds: readPositiveInteger("OTP_RESEND_COOLDOWN_SECONDS", 30),
        maxVerificationAttempts: readPositiveInteger("OTP_MAX_ATTEMPTS", 5),
        verificationLockSeconds: readPositiveInteger("OTP_VERIFICATION_LOCK_SECONDS", 60),
    };
};

module.exports = getOtpConfig;
