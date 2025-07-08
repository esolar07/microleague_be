import { Request, Response } from 'express';
import OpenAI from 'openai';

const openAiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface GameRequestBody{
    sport: string;
    teamOneYear: string;
    teamOneName: string;
    teamTwoYear: string;
    teamTwoName: string;
}

function preparePrompt(sport: string, teamOneYear: string, teamOneName:string, teamTwoYear: string, teamTwoName: string) {
    return `what would happen if ${teamOneYear} ${teamOneName } played the ${teamTwoYear} ${teamTwoName}`;
}

async function generateGamee() {
    const response = await client.responses.create({
        model: "gpt-4.1",
        input: preparePrompt(sport, teamOneYear, teamOneName, teamTwoYear, teamTwoName),
    });
}
export const simluateGame = async (req: Request, res: Response) => {
    try {
        const {sport, teamOneYear, teamOneName, teamTwoYear, teamTwoName} = req.body;
        if (
            typeof sport !== 'string' &&
            typeof teamOneYear !== 'string' &&
            typeof teamOneName !== 'string' &&
            typeof teamTwoYear !== 'string' &&
            typeof teamTwoName !== 'string'
        ) {
            return res.status(400).json({ message: 'All parameters must be strings.' });
        }
        preparePrompt(sport, teamOneYear, teamOneName, teamTwoYear, teamTwoName);
        res.status(200).json({
            message: 'Parameters received successfully!',
            data: { sport, teamOneYear, teamOneName, teamTwoYear, teamTwoName},
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
}