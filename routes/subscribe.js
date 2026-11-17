const express = require("express");
const { getSubscribers, subscribeNewsletter, verifyEmail } = require("../controllers/subscribe");

const router = express.Router();

//Routes
router.get("/subscribers", getSubscribers)
router.post("/subscribe", subscribeNewsletter)
router.post("/verify-email", verifyEmail)

module.exports = router;