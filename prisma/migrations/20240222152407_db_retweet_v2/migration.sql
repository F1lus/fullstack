-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tweet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" DATETIME,
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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
