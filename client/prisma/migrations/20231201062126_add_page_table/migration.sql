-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "css" TEXT NOT NULL DEFAULT 'none',
    "html" TEXT NOT NULL DEFAULT 'none',
    "themeId" TEXT NOT NULL
);
