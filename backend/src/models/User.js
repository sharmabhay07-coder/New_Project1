const mongoose = require("mongoose");
const ROLES = require("../constants/Roles");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },
        
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.USER,
        },

    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;