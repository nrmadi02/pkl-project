/*
  Warnings:

  - A unique constraint covering the columns `[nomorInduk]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nomorInduk` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `nomorInduk` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_nomorInduk_key` ON `users`(`nomorInduk`);
