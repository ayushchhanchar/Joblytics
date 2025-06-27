import { addApplication } from "../controllers/application.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import router from "./auth.routes";

//@ts-ignore
router.post("/add-applications",requireAuth,addApplication)
export default router;