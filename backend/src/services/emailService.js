const REQUIRED_EMAIL_ENV = [
    "BREVO_API_KEY",
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

    return {
        apiKey: process.env.BREVO_API_KEY.trim(),
        from: process.env.EMAIL_FROM.trim(),
        replyTo: process.env.EMAIL_REPLY_TO?.trim() || undefined,
    };
};

const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const sendOtpEmail = async ({ to, name, otp, expiresInMinutes = 5 }) => {
    const recipient = maskEmail(to);
    const config = getEmailConfig();

    const payload = {
        sender: { email: config.from },
        to: [{ email: to, name: name || undefined }],
        replyTo: config.replyTo ? { email: config.replyTo } : undefined,
        subject: `${otp} is your EarnHub verification code`,
        textContent: [
            `Hello ${name || "there"},`,
            "",
            `Your EarnHub verification code is ${otp}.`,
            `It expires in ${expiresInMinutes} minutes.`,
            "",
            "If you did not create this account, you can ignore this email.",
        ].join("\n"),
        htmlContent: `
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
    };

    try {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": config.apiKey,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data?.message || `Brevo API responded with status ${res.status}`);
        }

        console.info(
            `[EMAIL] OTP queued recipient=${recipient} messageId=${data.messageId || "unknown"}`
        );

        return data;
    } catch (error) {
        if (error instanceof EmailServiceError) throw error;

        console.error(
            `[EMAIL] OTP delivery failed recipient=${recipient} message=${error.message}`
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
        const config = getEmailConfig();

        const res = await fetch("https://api.brevo.com/v3/account", {
            method: "GET",
            headers: { "api-key": config.apiKey },
        });

        if (!res.ok) {
            throw new Error(`Brevo API key check failed with status ${res.status}`);
        }

        console.info("[EMAIL] Brevo API connection verified");
        return true;
    } catch (error) {
        const code = error.code || "EMAIL_CONFIGURATION_ERROR";
        console.error(`[EMAIL] Email service verification failed code=${code} message=${error.message}`);
        throw error;
    }
};

module.exports = {
    EmailServiceError,
    maskEmail,
    sendOtpEmail,
    verifyEmailTransport,
};