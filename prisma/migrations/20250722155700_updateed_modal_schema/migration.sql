/*
  Warnings:

  - The primary key for the `MatchUp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MatchUp` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `MatchUpResult` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MatchUpResult` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `matchUpId` on the `MatchUpResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SportType" AS ENUM ('BASKETBALL', 'BASEBALL', 'FOOTBALL');

-- DropForeignKey
ALTER TABLE "MatchUpResult" DROP CONSTRAINT "MatchUpResult_matchUpId_fkey";

-- AlterTable
ALTER TABLE "MatchUp" DROP CONSTRAINT "MatchUp_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "MatchUp_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MatchUpResult" DROP CONSTRAINT "MatchUpResult_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "matchUpId",
ADD COLUMN     "matchUpId" INTEGER NOT NULL,
ADD CONSTRAINT "MatchUpResult_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "MatchUpResult" ADD CONSTRAINT "MatchUpResult_matchUpId_fkey" FOREIGN KEY ("matchUpId") REFERENCES "MatchUp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
