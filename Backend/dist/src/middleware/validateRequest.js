"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: error.issues.map((item) => ({
                    field: item.path.join("."),
                    message: item.message,
                })),
            });
        }
        next(error);
    }
};
exports.validateRequest = validateRequest;
