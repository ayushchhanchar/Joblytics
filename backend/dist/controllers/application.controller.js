"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplicationStatus = exports.getApplication = exports.addApplication = void 0;
const auth_application_1 = require("../validators/auth.application");
const prisma_1 = require("../conifg/prisma");
const client_1 = require("@prisma/client");
const addApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = auth_application_1.addApplicationSchema.safeParse(req.body);
    console.log("Received application data:", req.body);
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }
    const { company, role, jobUrl, location, status, appliedAt } = parsed.data;
    try {
        const application = yield prisma_1.Client.application.create({
            data: {
                userId: req.user.userId,
                company,
                role,
                jobUrl,
                location,
                status,
                appliedAt: appliedAt || new Date(),
            },
        });
        return res.status(201).json({ application });
    }
    catch (err) {
        return res.status(500).json({ error: "Could not create application" });
    }
});
exports.addApplication = addApplication;
const getApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const applications = yield prisma_1.Client.application.findMany({
            where: {
                userId: req.user.userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.send(applications);
    }
    catch (err) {
        res.status(500).send().json({ error: "Could not fetch applications" });
    }
});
exports.getApplication = getApplication;
const updateApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Updating Application:", req.body);
    const { id } = req.params;
    const { status, company, role, jobUrl, location, appliedAt } = req.body;
    console.log("ststus-----", status);
    console.log("id-----", id);
    try {
        // Build update data object - only include fields that are provided
        const updateData = {};
        if (status !== undefined) {
            const isValidStatus = Object.values(client_1.ApplicationStatus).includes(status);
            if (!isValidStatus) {
                return res.status(400).json({ error: "Invalid status value" });
            }
            updateData.status = status;
        }
        if (company !== undefined)
            updateData.company = company;
        if (role !== undefined)
            updateData.role = role;
        if (jobUrl !== undefined)
            updateData.jobUrl = jobUrl;
        if (location !== undefined)
            updateData.location = location;
        if (appliedAt !== undefined)
            updateData.appliedAt = new Date(appliedAt);
        const updated = yield prisma_1.Client.application.update({
            where: { id },
            data: updateData,
        });
        res.json({ application: updated });
    }
    catch (err) {
        console.error("error--------------", err);
        res.status(500).json({ error: "Could not update application" });
    }
});
exports.updateApplicationStatus = updateApplicationStatus;
const deleteApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleted = yield prisma_1.Client.application.delete({
            where: { id },
        });
        res.json({ application: deleted });
    }
    catch (err) {
        console.error("error--------------", err);
        res.status(500).json({ error: "Could not delete application" });
    }
});
exports.deleteApplication = deleteApplication;
