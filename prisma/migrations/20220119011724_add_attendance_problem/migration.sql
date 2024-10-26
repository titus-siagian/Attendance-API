/*
  Warnings:

  - The values [A1,A2,A3,A4,A5] on the enum `Attendance_value` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Attendance` ADD COLUMN `problem` ENUM('A1', 'A2', 'A3', 'A4', 'A5') NULL,
    MODIFY `value` ENUM('ClockIn', 'ClockOut') NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `dateOfBirth` DATE NULL;
