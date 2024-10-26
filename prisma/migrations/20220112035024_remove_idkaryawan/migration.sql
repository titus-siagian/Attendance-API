/*
  Warnings:

  - You are about to drop the column `userIdKaryawan` on the `EmployeeSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `idKaryawan` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `EmployeeSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `EmployeeSchedule` DROP FOREIGN KEY `EmployeeSchedule_userIdKaryawan_fkey`;

-- DropIndex
DROP INDEX `User_idKaryawan_key` ON `User`;

-- AlterTable
ALTER TABLE `EmployeeSchedule` DROP COLUMN `userIdKaryawan`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `idKaryawan`;

-- AddForeignKey
ALTER TABLE `EmployeeSchedule` ADD CONSTRAINT `EmployeeSchedule_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
