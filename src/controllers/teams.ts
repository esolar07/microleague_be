import { Request, Response } from 'express';

interface SeasonItem {
    $ref: string;
}

interface TeamListItem {
    $ref: string;
}

interface TeamDetailsApiResponse {
    displayName: string;
    logos: Array<{ href: string }>;
}

type TeamDetailsResponse = Record<string, { id: string; image: string | null }>;

export const getSeasonBySport = async (req: Request, res: Response): Promise<void> => {
    const seasonEndpoint = `${process.env.TEAMS_DATA_ENDPOINT}/v2/sports/${req.params.sport}/leagues/nfl/seasons`;
    let seasonList = [];
    try {
        const response = await fetch(seasonEndpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const seasonData: { items: SeasonItem[] } = await response.json();
        seasonData.items.forEach(  (seasonDataItem) => {
            const seasonYear = seasonDataItem.$ref.match(/seasons\/(\d{4})/);
            seasonList.push(seasonYear[1]);
        });
        res.status(200).json({
            message: 'All season returned',
            data:  seasonList,
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
    const teamDetailsEndpoint = `${process.env.TEAMS_DATA_ENDPOINT}/v2/sports/${sport}/leagues/nfl/seasons/${season}/teams/${teamId}?lang=en&region=us`;
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
    const { sport, season } = req.params;
    let seasonTeamsEndpoint = `${process.env.TEAMS_DATA_ENDPOINT}/v2/sports/${sport}/leagues/nfl/seasons/${season}/teams`;
    let teamList: TeamDetailsResponse[] = [];
    try {
        const response = await fetch(seasonTeamsEndpoint);
        if (!response.ok) {
            throw new Error(`Error fetching teams by season data! status: ${response.status}`);
        }
        const teamListData: { items: TeamListItem[] } = await response.json();
        for(const teamListDataItem of teamListData.items){
            let teamIdMatch = teamListDataItem.$ref.match(/teams\/(\d+)/);
            if (teamIdMatch && teamIdMatch[1]) {
                let teamDetails = await getTeamDetails(sport, season, teamIdMatch[1])
                teamList.push(teamDetails);
            }
        }
        res.status(200).json({
            message: 'All season returned',
            data:  teamList,
        });
    } catch (e) {
        console.error('Error fetching teams by season data:', e);
        res.status(500).json({
            message: 'Internal server error.',
            error: e instanceof Error ? e.message : 'Unknown error',
        });
    }
}
// export const getTeam = async (req: Request<{}, {}, GameRequestBody>, res: Response) => {}
