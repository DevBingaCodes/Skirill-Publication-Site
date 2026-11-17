const crypto = require("crypto");
const pool = require("../config/db");
const { newsletterVerificationEmail } = require("./emailService");

//Subscribe Publication
const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Validate input
        if (!email || typeof email !== "string") {
            return res.status(400).json({
                message: "A valid email address is required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail) ||
            normalizedEmail.length > 255) {
            return res.status(400).json({
                message: "Please provide a valid email address."
            });
        }

        // 2. Generate a secure verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        // Only store the SHA-256 hash in the database
        const tokenHash = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        // 24-hour expiry
        const tokenExpiry = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        // 3. Check whether subscriber already exists
        const existing = await pool.query(
            `SELECT id, status
             FROM subscribers
             WHERE email = $1`,
            [normalizedEmail]
        );

        // Already subscribed
        if (existing.rows.length > 0 &&
            existing.rows[0].status === "active") {
            return res.status(200).json({
                message: "You are already subscribed. Stay tuned for our updates!"
            });
        }

        let subscriber;

        if (existing.rows.length > 0) {

            // Refresh pending or previously unsubscribed record
            const result = await pool.query(
                `UPDATE subscribers
                 SET status = 'pending',
                     verification_token_hash = $1,
                     verification_token_expires_at = $2,
                     unsubscribed_at = NULL,
                     updated_at = NOW()
                 WHERE id = $3
                 RETURNING id, email`,
                [
                    tokenHash,
                    tokenExpiry,
                    existing.rows[0].id
                ]
            );

            subscriber = result.rows[0];

        } else {

            // Create new subscriber
            const result = await pool.query(
                `INSERT INTO subscribers (
                    email,
                    status,
                    verification_token_hash,
                    verification_token_expires_at
                 )
                 VALUES ($1, 'pending', $2, $3)
                 RETURNING id, email`,
                [
                    normalizedEmail,
                    tokenHash,
                    tokenExpiry
                ]
            );

            subscriber = result.rows[0];
        }

        // 4. Send confirmation email through Brevo
        const emailResult = await newsletterVerificationEmail(
            subscriber.email,
            verificationToken
        );

        console.log(
            "Verification email accepted:",
            emailResult.messageId
        );

        return res.status(200).json({
            message: "Check your inbox to confirm your subscription."
        });

    } catch (error) {

        console.error(
            "Newsletter subscription error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            message: "Unable to process your subscription. Please try again."
        });
    }
};

//Fetch Subscribers
// Verify email address
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token || typeof token !== "string" ||
            !/^[a-f0-9]{64}$/i.test(token)) {
            return res.status(400).json({
                message: "Invalid verification link."
            });
        }

        // Hash the supplied token
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // 1. Find a matching, unexpired pending subscription
        const result = await pool.query(
            `UPDATE subscribers
             SET status = 'active',
                 subscribed_at = NOW(),
                 verification_token_hash = NULL,
                 verification_token_expires_at = NULL,
                 updated_at = NOW()
             WHERE verification_token_hash = $1
               AND verification_token_expires_at > NOW()
               AND status = 'pending'
             RETURNING id, email`,
            [tokenHash]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                message: "This verification link is invalid, expired, or already used."
            });
        }

        return res.status(200).json({
            message: "Your subscription has been confirmed successfully!"
        });

    } catch (error) {

        console.error("Email verification error:", error.message);

        return res.status(500).json({
            message: "Unable to verify your subscription."
        });
    }
};

// Fetch subscribers
const getSubscribers = async (req, res) => {
    try {
        const page = Math.max(
            1,
            parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
            100,
            Math.max(1, parseInt(req.query.limit, 10) || 20)
        );

        const offset = (page - 1) * limit;

        const status = req.query.status;

        const validStatuses = [
            "pending",
            "active",
            "unsubscribed"
        ];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid subscriber status."
            });
        }

        const query = status
            ? `SELECT id, email, status, subscribed_at,
                      unsubscribed_at, created_at
               FROM subscribers
               WHERE status = $1
               ORDER BY created_at DESC
               LIMIT $2 OFFSET $3`
            : `SELECT id, email, status, subscribed_at,
                      unsubscribed_at, created_at
               FROM subscribers
               ORDER BY created_at DESC
               LIMIT $1 OFFSET $2`;

        const values = status
            ? [status, limit, offset]
            : [limit, offset];

        const [subscribers, count] = await Promise.all([
            pool.query(query, values),

            pool.query(
                status
                    ? "SELECT COUNT(*) FROM subscribers WHERE status = $1"
                    : "SELECT COUNT(*) FROM subscribers",
                status ? [status] : []
            )
        ]);

        const total = Number(count.rows[0].count);

        return res.status(200).json({
            subscribers: subscribers.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {

        console.error("Fetching subscribers error:", error.message);

        return res.status(500).json({
            message: "Unable to retrieve subscribers."
        });
    }
};


module.exports =  { subscribeNewsletter, verifyEmail, getSubscribers }