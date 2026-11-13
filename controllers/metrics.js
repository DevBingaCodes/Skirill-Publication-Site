
const {
    collectDefaultMetrics,
    Counter,
    Histogram,
    register,
} = require("@prometheus-io/client");

// Collect Node.js and process metrics.
collectDefaultMetrics();

// Total HTTP requests.
const httpRequests = new Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests handled by the API.",
    labelNames: ["method", "status_code"],
});

// HTTP request duration.
const httpRequestDuration = new Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds.",
    labelNames: ["method"],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

// HTTP instrumentation middleware.

function trackHttpRequests(req, res, next) {

    const path = req.path;

    // Exclude Prometheus scrapes.
    if (path === "/publication-site/v1/metrics") {
        return next();
    }

    console.log("[METRICS] Middleware reached:", req.method, req.originalUrl);

    const endTimer = httpRequestDuration.startTimer({
        method: req.method,
    });

    res.on("finish", () => {

        console.log(
            "[METRICS] Response finished:",
            req.method,
            req.originalUrl,
            res.statusCode
        );

        httpRequests.inc({
            method: req.method,
            status_code: String(res.statusCode),
        });

        endTimer();

        console.log(
            "[METRICS] Counter incremented:",
            req.method,
            res.statusCode
        );
    });

    next();
}


// Prometheus scrape handler.
async function getMetrics(req, res) {
    try {
        res.set("Content-Type", register.contentType);
        res.end(await register.metrics());
    } catch (error) {
        console.error("Metrics collection error:", error);
        res.status(500).send("Unable to collect metrics");
    }
}

module.exports = {
    httpRequests,
    httpRequestDuration,
    trackHttpRequests,
    getMetrics,
};
