"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await (0, auth_service_1.registerService)(email, password);
        res.status(201).json(data);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await (0, auth_service_1.loginService)(email, password);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const me = async (req, res, next) => {
    try {
        const user = await (0, auth_service_1.meService)(req.user.userId);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.me = me;
