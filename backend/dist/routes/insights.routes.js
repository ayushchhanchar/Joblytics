"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insights_controller_1 = require("../controllers/insights.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Get comprehensive insights data
//@ts-ignore
router.get("/insights", auth_middleware_1.requireAuth, insights_controller_1.getInsights);
// Get application statistics
//@ts-ignore
router.get("/insights/stats", auth_middleware_1.requireAuth, insights_controller_1.getApplicationStats);
// Get response time analytics
//@ts-ignore
router.get("/insights/response-times", auth_middleware_1.requireAuth, insights_controller_1.getResponseTimeAnalytics);
// Get monthly goal progress
//@ts-ignore
router.get("/insights/goal-progress", auth_middleware_1.requireAuth, insights_controller_1.getMonthlyGoalProgress);
exports.default = router;
