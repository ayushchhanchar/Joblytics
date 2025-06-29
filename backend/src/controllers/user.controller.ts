import { Request, Response } from "express";
import { Client } from "../conifg/prisma";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/hash";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads/avatars/";
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const avatarUpload = multer({ 
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export const getUserDetails = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID missing in token' });
    }

    const user = await Client.user.findUnique({
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
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

export const updateProfile = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name, email, bio, location, website, linkedin, github } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID missing in token' });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await Client.user.findFirst({
        where: {
          email,
          NOT: { id: userId }
        }
      });

      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    const updateData: any = {
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
      const currentUser = await Client.user.findUnique({
        where: { id: userId },
        select: { avatarUrl: true }
      });

      if (currentUser?.avatarUrl) {
        const oldAvatarPath = path.join(process.cwd(), 'uploads', 'avatars', path.basename(currentUser.avatarUrl));
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      updateData.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    }

    const updatedUser = await Client.user.update({
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
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const changePassword = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID missing in token' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Get current user
    const user = await Client.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await Client.user.update({
      where: { id: userId },
      data: { 
        password: hashedNewPassword,
        passwordUpdatedAt: new Date()
      }
    });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

export const updateNotifications = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;
    const notificationSettings = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID missing in token' });
    }

    // In a real app, you'd store these in a separate notifications table
    // For now, we'll just return success
    res.json({ success: true, message: 'Notification settings updated' });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({ error: 'Failed to update notification settings' });
  }
};

export const updatePrivacy = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;
    const privacySettings = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID missing in token' });
    }

    // In a real app, you'd store these in a separate privacy settings table
    // For now, we'll just return success
    res.json({ success: true, message: 'Privacy settings updated' });
  } catch (error) {
    console.error('Update privacy error:', error);
    res.status(500).json({ error: 'Failed to update privacy settings' });
  }
};

export const exportUserData = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID missing in token' });
    }

    // Get all user data
    const user = await Client.user.findUnique({
      where: { id: userId },
      include: {
        applications: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive data
    const { password, ...userData } = user;

    const exportData = {
      exportDate: new Date().toISOString(),
      user: userData,
      totalApplications: user.applications.length,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=joblytics-data-export.json');
    res.json(exportData);
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
};

export const deleteAccount = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID missing in token' });
    }

    // Get user to check for files to delete
    const user = await Client.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true, resumeUrl: true }
    });

    // Delete user files
    if (user?.avatarUrl) {
      const avatarPath = path.join(process.cwd(), 'uploads', 'avatars', path.basename(user.avatarUrl));
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    if (user?.resumeUrl) {
      const resumePath = path.join(process.cwd(), 'uploads', 'resumes', path.basename(user.resumeUrl));
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
    }

    // Delete user and all related data (cascade delete)
    await Client.user.delete({
      where: { id: userId }
    });

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};