import { Router } from "express";
import { getUserDetails } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router()
//@ts-ignore
router.get("/userdetails",requireAuth,getUserDetails)

export default router