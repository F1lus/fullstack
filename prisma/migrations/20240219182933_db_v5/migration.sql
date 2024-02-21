-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "modifiedAt" DATETIME
);
INSERT INTO "new_User" ("createdAt", "description", "displayName", "email", "id", "modifiedAt", "name", "password", "profilePicturePath", "role") SELECT "createdAt", "description", "displayName", "email", "id", "modifiedAt", "name", "password", "profilePicturePath", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
