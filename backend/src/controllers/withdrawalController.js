const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");
const User = require("../models/User");
const Withdrawal = require("../models/withdrawal");

const createWithdrawalRequest = asyncHandler(async (req, res) => {

    const {
        amount,
        withdrawalMethod,
        accountDetails,
    } = req.body;

    if (amount <= 0) {
        res.status(400);
        throw new Error("Amount must be greater than 0");
    }

    if (req.user.balance < amount) {
        res.status(400);
        throw new Error("Insufficient balance");
    }

    const session = await mongoose.startSession();
    let withdrawal;

    try {
        await session.withTransaction(async () => {
            const updatedUser = await User.findOneAndUpdate(
                {
                    _id: req.user._id,
                    balance: { $gte: amount },
                },
                {
                    $inc: { balance: -amount },
                },
                {
                    new: true,
                    session,
                }
            );

            if (!updatedUser) {
                res.status(400);
                throw new Error("Insufficient balance");
            }

            const [createdWithdrawal] = await Withdrawal.create(
                [{
                    user: req.user._id,
                    amount,
                    withdrawalMethod,
                    accountDetails,
                }],
                { session }
            );

            withdrawal = createdWithdrawal;
            req.user.balance = updatedUser.balance;
        });
    } finally {
        session.endSession();
    }

    res.status(201).json({
        success: true,
        message: "Withdrawal request created successfully",
        data: {
            withdrawal,
        },
    });
});

module.exports = {
    createWithdrawalRequest,
};
