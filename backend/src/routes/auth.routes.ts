import { Router } from "express";
import { register, signIn } from "../controllers/auth.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();
//@ts-ignore
router.post("/register", upload.single("resume"), register);
//@ts-ignore

router.post("/signin", signIn);

export default router;