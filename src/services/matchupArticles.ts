import { PrismaClient } from  '@prisma/client';

const prisma = new PrismaClient();

export const storeMatchupResultArticle = async (matchResultsId: number, matchupArticle: any) => {
    try {
            return await prisma.matchupResultArticle.create({
            data: {
                matchupResultId: matchResultsId,
                matchupArticle: matchupArticle
            }
        });
    } catch (error) {
        console.error('Error storing created matchup result article:', error);
        throw error;
    }
}

export const getMatchupResultArticle = async (matchResultsId: number) => {
    try {
        return await prisma.matchupResultArticle.findFirst({
            where: { matchupResultId: matchResultsId }
        });
    } catch (error) {
        console.error('Error retrieving created matchup result article:', error);
        throw error;
    }
}