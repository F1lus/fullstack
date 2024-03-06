/*
  Warnings:

  - Made the column `modifiedAt` on table `Tweet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modifiedAt` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modifiedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tweet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" DATETIME NOT NULL,
    "originalTweetId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Tweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Tweet_originalTweetId_fkey" FOREIGN KEY ("originalTweetId") REFERENCES "Tweet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tweet" ("createdAt", "description", "id", "modifiedAt", "originalTweetId", "userId") SELECT "createdAt", "description", "id", "modifiedAt", "originalTweetId", "userId" FROM "Tweet";
DROP TABLE "Tweet";
ALTER TABLE "new_Tweet" RENAME TO "Tweet";
CREATE UNIQUE INDEX "Tweet_originalTweetId_key" ON "Tweet"("originalTweetId");
CREATE UNIQUE INDEX "Tweet_userId_key" ON "Tweet"("userId");
CREATE TABLE "new_Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "tweetId" TEXT NOT NULL,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("createdAt", "id", "modifiedAt", "text", "tweetId", "userId") SELECT "createdAt", "id", "modifiedAt", "text", "tweetId", "userId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE UNIQUE INDEX "Comment_userId_key" ON "Comment"("userId");
CREATE UNIQUE INDEX "Comment_tweetId_key" ON "Comment"("tweetId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'common',
    "description" TEXT,
    "profilePicturePath" TEXT NOT NULL DEFAULT '/profile_ph.webp',
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "description", "displayName", "email", "id", "modifiedAt", "name", "password", "profilePicturePath", "role") SELECT "createdAt", "description", "displayName", "email", "id", "modifiedAt", "name", "password", "profilePicturePath", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
