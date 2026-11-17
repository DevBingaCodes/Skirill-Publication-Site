const rateLimit = require("express-rate-limit");

//Login Endpoint Limiter
const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many authentication attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

//Password Reset Limiter
const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Strict limit: only 3 requests per window
    message: {
        title: "Too Many Requests",
        message: "Too many reset attempts. Please try again in 15 minutes."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Newsletter Subscription Limiter
const newsletterSubscribeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        title: "Too Many Requests",
        message: "Too many subscription attempts. Please try again in 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Newsletter Email Verification Limiter
const newsletterVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        title: "Too Many Requests",
        message: "Too many verification attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = { authLimiter, passwordResetLimiter, newsletterSubscribeLimiter, newsletterVerifyLimiter };