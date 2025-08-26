import { Request, Response } from 'express';
import { getMatchUpResults } from '../services/matchUpService';

export const fetchMatchUpDetails = async(req: Request, res: Response) => {
    try {
        const { matchUpResultId } = req.params;
        const matchUpDetails = await getMatchUpResults(Number(matchUpResultId));
        return res.status(200).json({
            message: 'Matchup details generated successfully',
            data: typeof matchUpDetails === 'string' ? JSON.parse(matchUpDetails) : matchUpDetails,
        });
    } catch (error) {
        console.error('Error fetching match-up details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};