const express = require("express");
const { getSubscribers, subscribeNewsletter, verifyEmail } = require("../controllers/subscribe");
const { authUser } = require("../middleware/jwt");
const { newsletterSubscribeLimiter, newsletterVerifyLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

//Routes
router.post("/subscribe", newsletterSubscribeLimiter, subscribeNewsletter)

router.get("/subscribers", authUser, getSubscribers)

router.get("/verify-email", newsletterVerifyLimiter, verifyEmail)


module.exports = router;