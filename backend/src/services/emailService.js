const nodemailer = require("nodemailer");

const REQUIRED_EMAIL_ENV = [
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "EMAIL_FROM",
];

class EmailServiceError extends Error {
    constructor(message, code, cause) {
        super(message, { cause });
        this.name = "EmailServiceError";
        this.code = code;
    }
}

const maskEmail = (email = "") => {
    const [localPart = "", domain = ""] = email.split("@");
    if (!domain) return "invalid-email";

    const visible = localPart.slice(0, Math.min(2, localPart.length));
    return `${visible}${"*".repeat(Math.max(1, localPart.length - visible.length))}@${domain}`;
};

const getEmailConfig = () => {
    const missing = REQUIRED_EMAIL_ENV.filter((key) => !process.env[key]?.trim());

    if (missing.length > 0) {
        throw new EmailServiceError(
            `Missing email environment variables: ${missing.join(", ")}`,
            "EMAIL_CONFIGURATION_ERROR"
        );
    }

    const port = Number(process.env.SMTP_PORT || 587);
    if (!Number.isInteger(port) || port <= 0) {
        throw new EmailServiceError(
            "SMTP_PORT must be a valid positive integer",
            "EMAIL_CONFIGURATION_ERROR"
        );
    }

    const secureValue = process.env.SMTP_SECURE?.trim().toLowerCase();
    if (secureValue && !["true", "false"].includes(secureValue)) {
        throw new EmailServiceError(
            "SMTP_SECURE must be either true or false",
            "EMAIL_CONFIGURATION_ERROR"
        );
    }

    return {
        host: process.env.SMTP_HOST.trim(),
        port,
        secure: secureValue ? secureValue === "true" : port === 465,
        auth: {
            user: process.env.SMTP_USER.trim(),
            pass: process.env.SMTP_PASS,
        },
    };
};

let transporter;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            ...getEmailConfig(),
            connectionTimeout: 15_000,
            greetingTimeout: 15_000,
            socketTimeout: 30_000,
        });
    }

    return transporter;
};

const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const sendOtpEmail = async ({ to, name, otp, expiresInMinutes = 5 }) => {
    const recipient = maskEmail(to);

    try {
        const info = await getTransporter().sendMail({
            from: process.env.EMAIL_FROM,
            to,
            replyTo: process.env.EMAIL_REPLY_TO || undefined,
            subject: `${otp} is your EarnHub verification code`,
            text: [
                `Hello ${name || "there"},`,
                "",
                `Your EarnHub verification code is ${otp}.`,
                `It expires in ${expiresInMinutes} minutes.`,
                "",
                "If you did not create this account, you can ignore this email.",
            ].join("\n"),
            html: `
                <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1f2937">
                    <h2 style="color:#10b981">Verify your EarnHub account</h2>
                    <p>Hello ${escapeHtml(name || "there")},</p>
                    <p>Use this verification code to finish creating your account:</p>
                    <div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:18px 0;color:#111827">
                        ${otp}
                    </div>
                    <p>This code expires in ${expiresInMinutes} minutes.</p>
                    <p style="font-size:13px;color:#6b7280">
                        If you did not create this account, you can safely ignore this email.
                    </p>
                </div>
            `,
        });

        if (Array.isArray(info.accepted) && info.accepted.length === 0) {
            throw new Error(`SMTP server rejected the recipient: ${info.response || "no response"}`);
        }

        console.info(
            `[EMAIL] OTP queued recipient=${recipient} messageId=${info.messageId || "unknown"} response=${info.response || "accepted"}`
        );

        return info;
    } catch (error) {
        if (error instanceof EmailServiceError) throw error;

        console.error(
            `[EMAIL] OTP delivery failed recipient=${recipient} code=${error.code || "unknown"} command=${error.command || "unknown"} responseCode=${error.responseCode || "unknown"} message=${error.message}`
        );

        throw new EmailServiceError(
            "The email provider rejected or failed to send the OTP email",
            "EMAIL_DELIVERY_FAILED",
            error
        );
    }
};

const verifyEmailTransport = async () => {
    try {
        await getTransporter().verify();
        console.info(
            `[EMAIL] SMTP connection verified host=${process.env.SMTP_HOST} port=${process.env.SMTP_PORT || 587}`
        );
        return true;
    } catch (error) {
        const code = error.code || "EMAIL_CONFIGURATION_ERROR";
        console.error(`[EMAIL] SMTP verification failed code=${code} message=${error.message}`);
        throw error;
    }
};

module.exports = {
    EmailServiceError,
    maskEmail,
    sendOtpEmail,
    verifyEmailTransport,
};
