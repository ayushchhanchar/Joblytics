"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addApplicationSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.addApplicationSchema = zod_1.z.object({
    company: zod_1.z.string().min(1, "Company name is required"),
    role: zod_1.z.string().min(1, "Job position is required"),
    jobUrl: zod_1.z.string().url("Invalid job URL"),
    location: zod_1.z.string().min(1, "Location is required"),
    status: zod_1.z.nativeEnum(client_1.ApplicationStatus).default(client_1.ApplicationStatus.APPLIED).optional(),
    appliedAt: zod_1.z.date().optional(),
});
