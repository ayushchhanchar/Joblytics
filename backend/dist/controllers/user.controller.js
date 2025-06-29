"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.exportUserData = exports.updatePrivacy = exports.updateNotifications = exports.changePassword = exports.updateProfile = exports.getUserDetails = exports.avatarUpload = void 0;
const prisma_1 = require("../conifg/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const hash_1 = require("../utils/hash");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Configure multer for avatar uploads
const avatarStorage = multer_1.default.diskStorage({
    destination: "./uploads/avatars/",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.avatarUpload = (0, multer_1.default)({
    storage: avatarStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID missing in token' });
        }
        const user = yield prisma_1.Client.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                location: true,
                website: true,
                linkedin: true,
                github: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true,
                resumeUrl: true,
                resumeText: true,
                passwordUpdatedAt: true,
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true, user });
    }
    catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
});
exports.getUserDetails = getUserDetails;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { name, email, bio, location, website, linkedin, github } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID missing in token' });
        }
        // Check if email is already taken by another user
        if (email) {
            const existingUser = yield prisma_1.Client.user.findFirst({
                where: {
                    email,
                    NOT: { id: userId }
                }
            });
            if (existingUser) {
                return res.status(409).json({ error: 'Email already in use' });
            }
        }
        const updateData = {
            name,
            email,
            bio: bio || null,
            location: location || null,
            website: website || null,
            linkedin: linkedin || null,
            github: github || null,
        };
        // Handle avatar upload
        if (req.file) {
            // Delete old avatar if exists
            const currentUser = yield prisma_1.Client.user.findUnique({
                where: { id: userId },
                select: { avatarUrl: true }
            });
            if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.avatarUrl) {
                const oldAvatarPath = path_1.default.join(process.cwd(), 'uploads', 'avatars', path_1.default.basename(currentUser.avatarUrl));
                if (fs_1.default.existsSync(oldAvatarPath)) {
                    fs_1.default.unlinkSync(oldAvatarPath);
                }
            }
            updateData.avatarUrl = `/uploads/avatars/${req.file.filename}`;
        }
        const updatedUser = yield prisma_1.Client.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                location: true,
                website: true,
                linkedin: true,
                github: true,
                avatarUrl: true,
                updatedAt: true,
            }
        });
        res.json({ success: true, user: updatedUser });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
exports.updateProfile = updateProfile;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { currentPassword, newPassword } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID missing in token' });
        }
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }
        // Get current user
        const user = yield prisma_1.Client.user.findUnique({
            where: { id: userId },
            select: { password: true }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Verify current password
        const isCurrentPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }
        // Hash new password
        const hashedNewPassword = yield (0, hash_1.hashPassword)(newPassword);
        // Update password
        yield prisma_1.Client.user.update({
            where: { id: userId },
            data: {
                password: hashedNewPassword,
                passwordUpdatedAt: new Date()
            }
        });
        res.json({ success: true, message: 'Password changed successfully' });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});
exports.changePassword = changePassword;
const updateNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const notificationSettings = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID missing in token' });
        }
        // In a real app, you'd store these in a separate notifications table
        // For now, we'll just return success
        res.json({ success: true, message: 'Notification settings updated' });
    }
    catch (error) {
        console.error('Update notifications error:', error);
        res.status(500).json({ error: 'Failed to update notification settings' });
    }
});
exports.updateNotifications = updateNotifications;
const updatePrivacy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const privacySettings = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID missing in token' });
        }
        // In a real app, you'd store these in a separate privacy settings table
        // For now, we'll just return success
        res.json({ success: true, message: 'Privacy settings updated' });
    }
    catch (error) {
        console.error('Update privacy error:', error);
        res.status(500).json({ error: 'Failed to update privacy settings' });
    }
});
exports.updatePrivacy = updatePrivacy;
const exportUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID missing in token' });
        }
        // Get all user data
        const user = yield prisma_1.Client.user.findUnique({
            where: { id: userId },
            include: {
                applications: true
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Remove sensitive data
        const { password } = user, userData = __rest(user, ["password"]);
        const exportData = {
            exportDate: new Date().toISOString(),
            user: userData,
            totalApplications: user.applications.length,
        };
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=joblytics-data-export.json');
        res.json(exportData);
    }
    catch (error) {
        console.error('Export data error:', error);
        res.status(500).json({ error: 'Failed to export data' });
    }
});
exports.exportUserData = exportUserData;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID missing in token' });
        }
        // Get user to check for files to delete
        const user = yield prisma_1.Client.user.findUnique({
            where: { id: userId },
            select: { avatarUrl: true, resumeUrl: true }
        });
        // Delete user files
        if (user === null || user === void 0 ? void 0 : user.avatarUrl) {
            const avatarPath = path_1.default.join(process.cwd(), 'uploads', 'avatars', path_1.default.basename(user.avatarUrl));
            if (fs_1.default.existsSync(avatarPath)) {
                fs_1.default.unlinkSync(avatarPath);
            }
        }
        if (user === null || user === void 0 ? void 0 : user.resumeUrl) {
            const resumePath = path_1.default.join(process.cwd(), 'uploads', 'resumes', path_1.default.basename(user.resumeUrl));
            if (fs_1.default.existsSync(resumePath)) {
                fs_1.default.unlinkSync(resumePath);
            }
        }
        // Delete user and all related data (cascade delete)
        yield prisma_1.Client.user.delete({
            where: { id: userId }
        });
        res.json({ success: true, message: 'Account deleted successfully' });
    }
    catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});
exports.deleteAccount = deleteAccount;
