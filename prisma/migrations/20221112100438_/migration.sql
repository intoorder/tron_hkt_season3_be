/*
  Warnings:

  - Added the required column `random_number` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "last_updated_at" TIMESTAMP(3),
ADD COLUMN     "random_number" INTEGER NOT NULL,
ADD COLUMN     "token_total" INTEGER NOT NULL DEFAULT 0;
