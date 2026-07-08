const mongoose = require("mongoose");
const withdrawalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
        },

        withdrawalMethod: {
            type: String,
            required: true,
        },

        accountDetails: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        reviewNote: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);

module.exports = Withdrawal;
