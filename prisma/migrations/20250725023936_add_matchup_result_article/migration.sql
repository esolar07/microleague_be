-- CreateTable
CREATE TABLE "MatchupResultArticle" (
    "id" SERIAL NOT NULL,
    "matchupResultId" INTEGER NOT NULL,
    "matchupArticle" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchupResultArticle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MatchupResultArticle" ADD CONSTRAINT "MatchupResultArticle_matchupResultId_fkey" FOREIGN KEY ("matchupResultId") REFERENCES "MatchUpResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
