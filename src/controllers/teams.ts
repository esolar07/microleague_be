import { Request, Response } from 'express';
import { SeasonItem, TeamListItem, TeamDetailsApiResponse, TeamDetailsResponse } from '../types/teams';
import { Sport, League } from '../types/sports';
require('dotenv').config();

const getLeagueType = (sport: Sport):League => {
    const leagueMap: Record<Sport, League> = {
        football: 'nfl',
        basketball: 'nba',
        baseball: 'mlb',
    };
    return leagueMap[sport];
}

export const getSeasonBySport = async (req: Request, res: Response): Promise<void> => {
    let allSeasonsList: string[] = [];
    let pageIndex: number = 1;
    let hasMorePages: boolean = true;
    let league: League = getLeagueType(req.params.sport as Sport);
    try {
        while (hasMorePages) {
            const seasonsEndpoint: string = `${process.env.TEAMS_DATA_ENDPOINT}/v2/sports/${req.params.sport}/leagues/${league}/seasons?page=${pageIndex}`;
            const seasonsResponse = await fetch(seasonsEndpoint);
            if (!seasonsResponse.ok) {
                throw new Error(`HTTP error! status: ${seasonsResponse.status}`);
            }
            const seasons = await seasonsResponse.json();
            seasons.items.forEach(  (seasonItem) => {
                const season = seasonItem.$ref.match(/seasons\/(\d{4})/);
                allSeasonsList.push(season[1]);
            });
            hasMorePages = pageIndex < seasons.pageCount;
            pageIndex += 1;
        }
        res.status(200).json({
            message: 'All season returned',
            data:  allSeasonsList,
        });
    } catch (e) {
        console.error('Error fetching seanson by sports data:', e);
        res.status(500).json({
            message: 'Error fetching season by sports data.',
            error: e instanceof Error ? e.message : 'Unknown error',
        });
    }
}

async function getTeamDetails(sport: string, season: string, teamId: string): Promise<TeamDetailsResponse | null> {
    let league: League = getLeagueType(sport as Sport);
    const teamDetailsEndpoint = `${process.env.TEAMS_DATA_ENDPOINT}/v2/sports/${sport}/leagues/${league}/seasons/${season}/teams/${teamId}?lang=en&region=us`;
    let teamDetails = {};
    try {
        const response = await fetch(teamDetailsEndpoint);
        if (!response.ok) {
            throw new Error(`Error fetching individual team data! status: ${response.status}`);
        }
        const teamDetailsData = await response.json();
        teamDetails = {
            id: teamId,
            name: teamDetailsData.displayName,
            image: teamDetailsData.logos[0]['href']
        }
        return teamDetails;
    } catch (e) {
        console.error('Error fetching individual team data', e);
        return teamDetails;
    }
}

export const getTeamsBySeason = async (req: Request, res: Response) => {
    let pageIndex:number = 1;
    let hasMorePages: boolean = true;
    const { sport, season } = req.params;
    let teamsList: TeamDetailsResponse[] = [];
    let league: League = getLeagueType(req.params.sport as Sport);
    try {
        while (hasMorePages) {
            let seasonTeamsEndpoint = `${process.env.TEAMS_DATA_ENDPOINT}/v2/sports/${sport}/leagues/${league}/seasons/${season}/teams?page=${pageIndex}`;

            const teamsResponse = await fetch(seasonTeamsEndpoint);
            if (!teamsResponse.ok) {
                throw new Error(`Error fetching teams by season data! status: ${teamsResponse.status}`);
            }
            const teams = await teamsResponse.json();
            for (const team of teams.items) {
                let teamIdMatch = team.$ref.match(/teams\/(\d+)/);
                if (teamIdMatch && teamIdMatch[1]) {
                    let teamDetails = await getTeamDetails(sport, season, teamIdMatch[1])
                    teamsList.push(teamDetails);
                }
            }
            hasMorePages = pageIndex < teams.pageCount;
            pageIndex += 1;
        }
        res.status(200).json({
            message: 'All season returned',
            data:  teamsList,
        });
    } catch (e) {
        console.error('Error fetching teams by season data:', e);
        res.status(500).json({
            message: 'Internal server error.',
            error: e instanceof Error ? e.message : 'Unknown error',
        });
    }
}
