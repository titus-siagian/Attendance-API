-- AlterTable
ALTER TABLE `Announcement` ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `subdivisionIds` JSON NULL;
