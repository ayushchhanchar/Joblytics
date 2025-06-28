"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    const token = req.headers.authorization;
    console.log("token------", token);
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(process.env.JWT_SECRET);
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("payload....", payload);
        req.user = payload;
        next();
    }
    catch (_a) {
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.requireAuth = requireAuth;
