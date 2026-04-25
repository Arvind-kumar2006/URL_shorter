"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = void 0;
const analytics_service_1 = require("../services/analytics.service");
const getAnalytics = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const result = await (0, analytics_service_1.getAnalyticsService)(shortCode);
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalytics = getAnalytics;
