/*
  Warnings:

  - The required column `resultsId` was added to the `Test` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Test" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resultsId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL
);
INSERT INTO "new_Test" ("createdAt", "id", "title") SELECT "createdAt", "id", "title" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
CREATE UNIQUE INDEX "Test_resultsId_key" ON "Test"("resultsId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
