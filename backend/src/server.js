const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler, } = require("./middleware/errorMiddleware");

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
}

connectDB();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Backend Server Running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});