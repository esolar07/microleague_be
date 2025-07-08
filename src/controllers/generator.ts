import { Request, Response } from 'express';
import OpenAI from 'openai';
require('dotenv').config();

const openAICLient = new OpenAI();

interface GameRequestBody{
    sport: string;
    teamOneYear: string;
    teamOneName: string;
    teamTwoYear: string;
    teamTwoName: string;
}

function preparePrompt(teamOneYear: string, teamOneName:string, teamTwoYear: string, teamTwoName: string) {
    return `what would happen if ${teamOneYear} ${teamOneName } played the ${teamTwoYear} ${teamTwoName}`;
}

async function generateGame(teamOneYear: string, teamOneName:string, teamTwoYear: string, teamTwoName: string) {
    const response = await openAICLient.chat.completions.create({
        model: "gpt-4.0", // or your correct model key
        messages: [{ role: "user", content: preparePrompt(teamOneYear, teamOneName, teamTwoYear, teamTwoName) }],
    });
    return response.choices?.[0]?.message?.content || 'No response generated.';
}

function isValidGameRequest(body: any): body is GameRequestBody {
    return (
        typeof body.sport === 'string' &&
        typeof body.teamOneYear === 'string' &&
        typeof body.teamOneName === 'string' &&
        typeof body.teamTwoYear === 'string' &&
        typeof body.teamTwoName === 'string'
    );
}

export const simulateGame = async (req: Request<{}, {}, GameRequestBody>, res: Response) => {
    try {
        const {sport, teamOneYear, teamOneName, teamTwoYear, teamTwoName} = req.body;
        if (!isValidGameRequest(req.body)) {
            return res.status(400).json({ message: 'All parameters must be strings.' });
        }
        const gameSimulation = await generateGame(teamOneYear, teamOneName, teamTwoYear, teamTwoName);
        await res.status(200).json({
            message: 'Parameters received successfully!',
            data:  gameSimulation,
        });
    } catch (e) {
        console.error("Simulation error:", e);
        res.status(500).json({
            message: 'Internal server error.',
            error: e instanceof Error ? e.message : 'Unknown error',
        });
    }
}