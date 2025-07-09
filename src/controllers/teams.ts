import { Request, Response } from 'express';


export const getSeasonBySport = async (req: Request, res: Response) => {
    let seasonEndpoint = `${process.env.TEAMS_DATA_ENDPOINT}/v2/sports/${req.params.sport}/leagues/nfl/seasons`;
    let seasonList = [];
    try {
        const response = await fetch(seasonEndpoint); // Replace with your target API
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const seasonData = await response.json();
        seasonData.items.forEach(  (seasonDataItem) => {
            const seasonYear = seasonDataItem.match(/seasons\/(\d{4})/);
            console.log(seasonYear)
            seasonList = seasonYear[1];
        });
        res.status(200).json({
            message: 'All season returned',
            data:  seasonList,
        });
    } catch (e) {
        console.error('Error fetching external data:', e);
        res.status(500).json({
            message: 'Internal server error.',
            error: e instanceof Error ? e.message : 'Unknown error',
        });
    }
}

// export const getTeam = async (req: Request<{}, {}, GameRequestBody>, res: Response) => {}
