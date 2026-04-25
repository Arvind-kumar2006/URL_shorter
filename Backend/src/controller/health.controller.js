"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = void 0;
const health_service_1 = require("../services/health.service");
const healthCheck = async (req, res) => {
    try {
        const result = await (0, health_service_1.healthService)();
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};
exports.healthCheck = healthCheck;
