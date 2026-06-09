const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");



const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        res.status(400);
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,

            },
        }
    });

});

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        },
    });

});

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Protected route accessed",
        data: {
            user: req.user,
        },
    });
});


module.exports = {
    registerUser,
    loginUser,
    getMe,
};