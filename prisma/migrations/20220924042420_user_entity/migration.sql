/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `provider` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('siswa', 'admin', 'perpus', 'wali', 'bk', 'guru') NULL DEFAULT 'siswa',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);
