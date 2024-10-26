/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `EmployeeSchedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `EmployeeSchedule_userId_key` ON `EmployeeSchedule`(`userId`);
