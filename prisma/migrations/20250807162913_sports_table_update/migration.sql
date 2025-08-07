npx prisma generate
/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Sports` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "MatchUpResult" DROP CONSTRAINT "MatchUpResult_matchUpId_fkey";

-- DropForeignKey
ALTER TABLE "MatchupResultArticle" DROP CONSTRAINT "MatchupResultArticle_matchupResultId_fkey";

-- CreateIndex
CREATE INDEX "MatchUp_sportId_idx" ON "MatchUp"("sportId");

-- CreateIndex
CREATE UNIQUE INDEX "Sports_name_key" ON "Sports"("name");

-- AddForeignKey
ALTER TABLE "MatchUpResult" ADD CONSTRAINT "MatchUpResult_matchUpId_fkey" FOREIGN KEY ("matchUpId") REFERENCES "MatchUp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchupResultArticle" ADD CONSTRAINT "MatchupResultArticle_matchupResultId_fkey" FOREIGN KEY ("matchupResultId") REFERENCES "MatchUpResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
