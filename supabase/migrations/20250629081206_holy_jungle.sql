/*
  # Add user profile and settings fields

  1. New User Fields
    - `bio` (text, optional) - User biography/description
    - `location` (text, optional) - User location
    - `website` (text, optional) - Personal website URL
    - `linkedin` (text, optional) - LinkedIn profile URL
    - `github` (text, optional) - GitHub profile URL
    - `avatarUrl` (text, optional) - Profile picture URL
    - `passwordUpdatedAt` (timestamp, optional) - Last password change date

  2. Security
    - All fields are optional to maintain backward compatibility
    - No RLS changes needed as user table already has proper access controls
*/

-- Add new profile fields to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bio" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "linkedin" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "github" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordUpdatedAt" TIMESTAMP(3);