/**
 * @file contains function that handle trivial request
 */

module.exports = {
    index(req, res) {
        res.status(200).json({
            status: "success",
            message: "REST API for ML Healthyeat",
        });
    },
    onLost(req, res) {
        res.status(404).json({
            status: "fail",
            message: "Route not found!",
        });
    },
    onError(err, req, res, next) {
        res.status(500).json({
            status: "error",
            error: {
                name: err.name || "Internal Server Error",
                message: err.message || "Internal Server Error",
            },
        });
    },
};