import { Router } from "express";
import { 
  getInsights, 
  getApplicationStats, 
  getResponseTimeAnalytics,
  getMonthlyGoalProgress 
} from "../controllers/insights.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Get comprehensive insights data
//@ts-ignore
router.get("/insights", requireAuth, getInsights);

// Get application statistics
//@ts-ignore
router.get("/insights/stats", requireAuth, getApplicationStats);

// Get response time analytics
//@ts-ignore
router.get("/insights/response-times", requireAuth, getResponseTimeAnalytics);

// Get monthly goal progress
//@ts-ignore
router.get("/insights/goal-progress", requireAuth, getMonthlyGoalProgress);

export default router;