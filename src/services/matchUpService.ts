import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const getSportIdByName = async (name: string) => {
    const sport = await prisma.sports.findFirst({
        where: { name }
    });
    return sport?.id ?? null;
};
export const createMatchUp = async (
    sport: string, 
    homeTeamSeason: string, 
    homeTeamName: string, 
    awayTeamSeason: string, 
    awayTeamName: string
) => {
    try {
        const sportId: number = await getSportIdByName(sport);
        if (!sportId) {
            throw new Error(`Sport with name ${sport} not found.`);
        }
        const matchUp = await prisma.matchUp.create({
            data: {
                sport: { connect: { id: sportId } },
                homeTeamSeason: homeTeamSeason,
                homeTeamName: homeTeamName,
                awayTeamSeason: awayTeamSeason,
                awayTeamName: awayTeamName
            },
        });
        return matchUp.id as number;
    } catch (error) {
        throw error;
    }
    
};

export const storeMatchUpResults = async (matchId: number, gameSimulation: any) => {
    try {
        return await prisma.matchUpResult.create({
            data: {
                matchUpId: matchId,
                simulation: gameSimulation        
            }
        });
    } catch (error) {
        console.error('Error storing created match up:', error);
        throw error;
    }
}