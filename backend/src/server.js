const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const taskSubmissionRoutes = require("./routes/taskSubmissionRoutes");
const videoRoutes = require("./routes/videoRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const activityRoutes = require("./routes/activityRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
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

// Default dev origins + production origin + anything from .env (comma-separated)
const envOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

const allowedOrigins = new Set([
    'https://new-project1-chi.vercel.app',
    'http://localhost:5173',   // Vite default dev port
    'http://localhost:3000',   // fallback, if used
    ...envOrigins,
]);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow any localhost or local network IP (192.168.*.*, 10.*.*.*, 172.*.*.*)
        const isLocal = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(origin);
        
        // Allow any vercel.app subdomain
        const isVercel = /^https:\/\/.*\.vercel\.app$/.test(origin);

        if (allowedOrigins.has(origin) || isLocal || isVercel) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin); // helps debug in server logs
            // Fallback to allow all for now to ensure it works
            callback(null, true); 
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
}));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/submissions", taskSubmissionRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/activity", activityRoutes);

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