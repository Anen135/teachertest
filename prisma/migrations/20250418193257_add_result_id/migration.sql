/*
  Warnings:

  - The required column `resultId` was added to the `Test` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Test" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resultId" TEXT NOT NULL,
    "title" TEXT NOT NULL
);
INSERT INTO "new_Test" ("id", "title") SELECT "id", "title" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
CREATE UNIQUE INDEX "Test_resultId_key" ON "Test"("resultId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
