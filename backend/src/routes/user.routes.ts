import { Router } from "express";
import { 
  getUserDetails, 
  updateProfile, 
  changePassword, 
  updateNotifications, 
  updatePrivacy, 
  exportUserData, 
  deleteAccount,
  avatarUpload 
} from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Get user details
//@ts-ignore
router.get("/userdetails", requireAuth, getUserDetails);

// Update profile (with avatar upload)
//@ts-ignore

router.patch("/profile", requireAuth, avatarUpload.single("avatar"), updateProfile);

//@ts-ignore
// Change password
router.patch("/change-password", requireAuth, changePassword);

//@ts-ignore
// Update notification settings
router.patch("/notifications", requireAuth, updateNotifications);

//@ts-ignore
// Update privacy settings
router.patch("/privacy", requireAuth, updatePrivacy);

//@ts-ignore
// Export user data
router.get("/export-data", requireAuth, exportUserData);

//@ts-ignore
// Delete account
router.delete("/account", requireAuth, deleteAccount);

export default router;