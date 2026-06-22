const asyncHandler = require("../utils/asyncHandler");
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

    const withdrawal = await Withdrawal.create({
        user: req.user._id,
        amount,
        withdrawalMethod,
        accountDetails,
    });

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