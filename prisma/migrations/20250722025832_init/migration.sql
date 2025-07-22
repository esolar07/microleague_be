-- CreateTable
CREATE TABLE "Sports" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchUp" (
    "id" TEXT NOT NULL,
    "sportId" INTEGER NOT NULL,
    "homeTeamSeason" TEXT NOT NULL,
    "homeTeamName" TEXT NOT NULL,
    "awayTeamSeason" TEXT NOT NULL,
    "awayTeamName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchUpResult" (
    "id" TEXT NOT NULL,
    "matchUpId" TEXT NOT NULL,
    "simulation" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchUpResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MatchUp" ADD CONSTRAINT "MatchUp_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchUpResult" ADD CONSTRAINT "MatchUpResult_matchUpId_fkey" FOREIGN KEY ("matchUpId") REFERENCES "MatchUp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
