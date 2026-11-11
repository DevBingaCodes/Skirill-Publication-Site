const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}


// Neon connection strings carry their TLS settings (use sslmode=verify-full).
// Do not override the URL with rejectUnauthorized: false.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});

pool.on("error", (err) => {
  console.error("PostgreSQL idle connection error:", err.code || err.name);
});

// pool.query returns its connection automatically after the startup check.
if (process.env.NODE_ENV !== "test") {
  pool.query("SELECT 1")
    .then(() => console.log("Connected to PostgreSQL database"))
    .catch((err) => console.error("PostgreSQL startup check failed:", err.code || err.name));
}

module.exports = pool;
