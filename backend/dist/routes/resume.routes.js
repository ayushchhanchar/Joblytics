"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resume_controller_1 = require("../controllers/resume.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
// Analyze uploaded resume
//@ts-ignore
router.post("/analyze", auth_middleware_1.requireAuth, upload_middleware_1.upload.single("resume"), resume_controller_1.analyzeResume);
// Get existing resume analysis
//@ts-ignore
router.get("/analysis", auth_middleware_1.requireAuth, resume_controller_1.getResumeAnalysis);
exports.default = router;
