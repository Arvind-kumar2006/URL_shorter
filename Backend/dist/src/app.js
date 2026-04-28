"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const url_routes_1 = __importDefault(require("./routes/url.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const url_controller_1 = require("./controller/url.controller");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1", auth_routes_1.default);
app.use("/api/v1", health_routes_1.default);
app.use("/api/v1", analytics_routes_1.default);
app.use("/api/v1", url_routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/:shortCode", url_controller_1.redirectToOriginal);
// LAST
app.use(errorHandler_1.errorHandler);
exports.default = app;
