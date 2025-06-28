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
exports.updateApplicationStatus = exports.getApplication = exports.addApplication = void 0;
const auth_application_1 = require("../validators/auth.application");
const prisma_1 = require("../conifg/prisma");
const client_1 = require("@prisma/client");
const addApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = auth_application_1.addApplicationSchema.safeParse(req.body);
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
                status: client_1.ApplicationStatus.APPLIED,
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
    const { id } = req.params;
    const { status } = req.body;
    console.log("ststus-----", status);
    console.log("id-----", id);
    try {
        const updated = yield prisma_1.Client.application.update({
            where: { id },
            data: { status: status },
        });
        res.json({ application: updated });
    }
    catch (err) {
        console.error("error--------------", err);
        res.status(500).json({ error: "Could not update application status" });
    }
});
exports.updateApplicationStatus = updateApplicationStatus;
