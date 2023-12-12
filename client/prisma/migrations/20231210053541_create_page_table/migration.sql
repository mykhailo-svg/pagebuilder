-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "css" TEXT NOT NULL DEFAULT 'none',
    "html" TEXT NOT NULL DEFAULT 'none',
    "template" TEXT NOT NULL,
    "templateType" TEXT NOT NULL DEFAULT 'page',
    "themeId" TEXT NOT NULL,
    "shouldPublish" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'neverPublished'
);
