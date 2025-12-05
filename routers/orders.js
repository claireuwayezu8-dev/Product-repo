const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middleware/auth");
const { placeOrder, getOrders } = require("../controller/orderController");

router.post("/", authMiddleware, placeOrder);
router.get("/", authMiddleware, getOrders);

module.exports = router;
