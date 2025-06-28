import { addApplication, deleteApplication, getApplication, updateApplicationStatus } from "../controllers/application.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import router from "./auth.routes";

//@ts-ignore
router.post("/add-applications",requireAuth,addApplication)
//@ts-ignore
router.get("/get-applications",requireAuth,getApplication)
//@ts-ignore
router.patch("/applications/:id", requireAuth, updateApplicationStatus);
//@ts-ignore
router.delete("/applications/:id", requireAuth, deleteApplication);

export default router;