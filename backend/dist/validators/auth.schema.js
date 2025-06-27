"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const nameRegex = /^[A-Za-z\s]+$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Name is required" })
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name must be at most 50 characters long")
        .regex(nameRegex, "Name must contain only letters and spaces"),
    email: zod_1.z.string({ required_error: "Email is required" }).email(),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 8 characters long")
        .max(50, "Password must be at most 50 characters long")
        .regex(strongPasswordRegex, "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"),
});
exports.signInSchema = zod_1.z.object({
    email: zod_1.z.string({ required_error: "Email is required" }).email(),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 8 characters long")
        .max(50, "Password must be at most 50 characters long")
        .regex(strongPasswordRegex, "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"),
});
