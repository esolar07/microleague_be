import { PrismaClient, $Enums } from '../../generated/prisma';
import {SportType}  from "../../generated/prisma";

const prisma = new PrismaClient();

export const getSportIdByName = async (name: string) => {
    const sportType = name.toUpperCase();
    if (!Object.values($Enums.SportType).includes(sportType as $Enums.SportType)) {
        throw new Error(`Invalid sport type: ${sportType}`);
    }
    const sport = await prisma.sports.findFirst({
        where: {
            name: sportType as $Enums.SportType
        }
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

export const getMatchUpResults = async (matchId: number) => {
    try {
        const simulationResults = await prisma.matchUpResult.findFirst({
            where: { matchUpId: matchId }
        });
        return simulationResults.simulation || null;
    } catch (error) {
        console.error('Error fetching match up results:', error);
        throw error;
    }
};
