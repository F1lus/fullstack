/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Tweet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "profilePicturePath" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" DATETIME
);
INSERT INTO "new_User" ("createdAt", "description", "displayName", "email", "id", "modifiedAt", "name", "password", "profilePicturePath") SELECT "createdAt", "description", "displayName", "email", "id", "modifiedAt", "name", "password", "profilePicturePath" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new__LikedTweets" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_LikedTweets_A_fkey" FOREIGN KEY ("A") REFERENCES "Tweet" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LikedTweets_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__LikedTweets" ("A", "B") SELECT "A", "B" FROM "_LikedTweets";
DROP TABLE "_LikedTweets";
ALTER TABLE "new__LikedTweets" RENAME TO "_LikedTweets";
CREATE UNIQUE INDEX "_LikedTweets_AB_unique" ON "_LikedTweets"("A", "B");
CREATE INDEX "_LikedTweets_B_index" ON "_LikedTweets"("B");
CREATE TABLE "new__LikedComments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_LikedComments_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LikedComments_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__LikedComments" ("A", "B") SELECT "A", "B" FROM "_LikedComments";
DROP TABLE "_LikedComments";
ALTER TABLE "new__LikedComments" RENAME TO "_LikedComments";
CREATE UNIQUE INDEX "_LikedComments_AB_unique" ON "_LikedComments"("A", "B");
CREATE INDEX "_LikedComments_B_index" ON "_LikedComments"("B");
CREATE TABLE "new_Tweet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "retweets" INTEGER NOT NULL DEFAULT 0,
    "isRetweet" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Tweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tweet" ("createdAt", "description", "id", "isRetweet", "modifiedAt", "retweets", "userId") SELECT "createdAt", "description", "id", "isRetweet", "modifiedAt", "retweets", "userId" FROM "Tweet";
DROP TABLE "Tweet";
ALTER TABLE "new_Tweet" RENAME TO "Tweet";
CREATE UNIQUE INDEX "Tweet_userId_key" ON "Tweet"("userId");
CREATE TABLE "new_Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" DATETIME,
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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
