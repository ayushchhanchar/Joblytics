import { Router } from "express";
import { analyzeResume, getResumeAnalysis } from "../controllers/resume.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// Analyze uploaded resume
//@ts-ignore
router.post("/analyze", requireAuth, upload.single("resume"), analyzeResume);

// Get existing resume analysis
//@ts-ignore

router.get("/analysis", requireAuth, getResumeAnalysis);

export default router;