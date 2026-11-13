
const client = require('@prometheus-io/client');

const register = new client.Registry();

// Automatically collect Node.js and process metrics.
client.collectDefaultMetrics({ register });

// HTTP request counter
const httpRequestCounter = new client.Counter({
    name: "http_requests_total",
    help: "Total number of completed HTTP requests",
    labelNames: ["method", "route", "status_code"],
    registers: [register],
});

// HTTP request duration histogram
const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    registers: [register],
});

function trackHttpRequests(req, res, next) {

    // Exclude Prometheus scrapes from application traffic.
    const path = req.path.replace(/\/+$/, "") || "/";

    if (
        path === "/publication-site/v1/metrics" ||
        path.startsWith("/publication-site/v1/metrics/")
    ) {
        return next();
    }

    const start = process.hrtime.bigint();

    res.once("finish", () => {

        // Use Express route templates to avoid high-cardinality labels.
        const route = req.route
            ? String(req.route.path)
            : "unmatched";

        const labels = {
            method: req.method,
            route,
            status_code: String(res.statusCode),
        };

        // Increment completed HTTP requests.
        httpRequestCounter.inc(labels);

        // Record request duration in seconds.
        const duration =
            Number(process.hrtime.bigint() - start) / 1e9;

        httpRequestDuration.observe(labels, duration);
    });

    next();
}

async function getMetrics(req, res) {
    try {
        const metrics = await register.metrics();

        res.set("Content-Type", register.contentType);
        res.end(metrics);

    } catch (error) {
        console.error("Metrics collection error:", error);
        res.status(500).send("Unable to collect metrics");
    }
}

module.exports = {
    httpRequestCounter,
    httpRequestDuration,
    trackHttpRequests,
    getMetrics,
};
