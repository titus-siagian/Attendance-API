/*
  Warnings:

  - You are about to drop the column `Description` on the `History` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `History` DROP COLUMN `Description`,
    ADD COLUMN `description` VARCHAR(191) NULL;
