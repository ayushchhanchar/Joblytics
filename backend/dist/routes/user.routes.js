"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Get user details
//@ts-ignore
router.get("/userdetails", auth_middleware_1.requireAuth, user_controller_1.getUserDetails);
// Update profile (with avatar upload)
//@ts-ignore
router.patch("/profile", auth_middleware_1.requireAuth, user_controller_1.avatarUpload.single("avatar"), user_controller_1.updateProfile);
//@ts-ignore
// Change password
router.patch("/change-password", auth_middleware_1.requireAuth, user_controller_1.changePassword);
//@ts-ignore
// Update notification settings
router.patch("/notifications", auth_middleware_1.requireAuth, user_controller_1.updateNotifications);
//@ts-ignore
// Update privacy settings
router.patch("/privacy", auth_middleware_1.requireAuth, user_controller_1.updatePrivacy);
//@ts-ignore
// Export user data
router.get("/export-data", auth_middleware_1.requireAuth, user_controller_1.exportUserData);
//@ts-ignore
// Delete account
router.delete("/account", auth_middleware_1.requireAuth, user_controller_1.deleteAccount);
exports.default = router;
