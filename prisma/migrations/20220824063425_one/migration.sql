/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `People` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `People_uid_key` ON `People`(`uid`);

-- CreateIndex
CREATE UNIQUE INDEX `User_id_key` ON `User`(`id`);
