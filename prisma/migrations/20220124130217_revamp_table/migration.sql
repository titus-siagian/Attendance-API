/*
  Warnings:

  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Division` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Subdivision` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `workSectionId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `WorkSection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Department` DROP FOREIGN KEY `Department_subdivisionId_fkey`;

-- DropForeignKey
ALTER TABLE `Division` DROP FOREIGN KEY `Division_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `Subdivision` DROP FOREIGN KEY `Subdivision_divisionId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_departmentId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_divisionId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_subdivisionId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_workSectionId_fkey`;

-- DropForeignKey
ALTER TABLE `WorkSection` DROP FOREIGN KEY `WorkSection_departmentId_fkey`;

-- AlterTable
ALTER TABLE `Attendance` MODIFY `problem` ENUM('A1', 'A2', 'A3', 'A4', 'A5', 'A6') NULL;

-- AlterTable
ALTER TABLE `Company` DROP PRIMARY KEY,
    MODIFY `id` CHAR(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Department` DROP PRIMARY KEY,
    MODIFY `id` CHAR(3) NOT NULL,
    MODIFY `subdivisionId` CHAR(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Division` DROP PRIMARY KEY,
    MODIFY `id` CHAR(3) NOT NULL,
    MODIFY `companyId` CHAR(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Subdivision` DROP PRIMARY KEY,
    MODIFY `id` CHAR(3) NOT NULL,
    MODIFY `divisionId` CHAR(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP COLUMN `workSectionId`,
    MODIFY `divisionId` CHAR(3) NULL,
    MODIFY `subdivisionId` CHAR(3) NULL,
    MODIFY `departmentId` CHAR(3) NULL,
    MODIFY `companyId` CHAR(3) NULL;

-- DropTable
DROP TABLE `WorkSection`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `Division`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_subdivisionId_fkey` FOREIGN KEY (`subdivisionId`) REFERENCES `Subdivision`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Division` ADD CONSTRAINT `Division_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_subdivisionId_fkey` FOREIGN KEY (`subdivisionId`) REFERENCES `Subdivision`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subdivision` ADD CONSTRAINT `Subdivision_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `Division`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
