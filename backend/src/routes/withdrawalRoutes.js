const express = require("express");

const {
    createWithdrawalRequest,
} = require("../controllers/withdrawalController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    createWithdrawalRequest
);

module.exports = router;