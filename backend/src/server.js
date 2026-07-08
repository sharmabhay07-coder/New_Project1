const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const taskSubmissionRoutes = require("./routes/taskSubmissionRoutes");
const videoRoutes = require("./routes/videoRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const { notFound, errorHandler, } = require("./middleware/errorMiddleware");
const { verifyEmailTransport } = require("./services/emailService");

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
}

connectDB();

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));


app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/submissions", taskSubmissionRoutes);

app.use("/api/videos", videoRoutes);

app.use("/api/withdrawals", withdrawalRoutes);

app.get("/", (req, res) => {
    res.send("Backend Server Running");
});

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    verifyEmailTransport().catch(() => {
        console.error(
            "[EMAIL] OTP emails are unavailable. Check SMTP_* and EMAIL_FROM values in backend/.env"
        );
    });
});
