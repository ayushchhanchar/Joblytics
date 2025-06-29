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
router.get("/userdetails", requireAuth, getUserDetails);

// Update profile (with avatar upload)
router.patch("/profile", requireAuth, avatarUpload.single("avatar"), updateProfile);

// Change password
router.patch("/change-password", requireAuth, changePassword);

// Update notification settings
router.patch("/notifications", requireAuth, updateNotifications);

// Update privacy settings
router.patch("/privacy", requireAuth, updatePrivacy);

// Export user data
router.get("/export-data", requireAuth, exportUserData);

// Delete account
router.delete("/account", requireAuth, deleteAccount);

export default router;