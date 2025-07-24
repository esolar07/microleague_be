import { Request, Response } from 'express';
import OpenAI from 'openai';
import {createMatchUp, storeMatchUpResults} from '../services/matchUpService';
import { prepareSimulationPrompt, prepareSimulationRecapArticlePrompt } from '../prompts/simulationPrompts';
import { GameRequestBody } from '../types/games';
require('dotenv').config();

const openAICLient = new OpenAI();

async function generateGame(request: GameRequestBody) {

    const response = await openAICLient.chat.completions.create({
        model: "gpt-4.1",
        messages: [{ role: "user", content: prepareSimulationPrompt(
                request.sport,
                request.homeTeamSeason,
                request.homeTeamName,
                request.awayTeamSeason,
                request.awayTeamName
            ) }],
        response_format:{type: "json_object"}
    });
    return response.choices?.[0]?.message?.content || 'No response generated.';
}

function isValidGameRequest(body: any): body is GameRequestBody {
    return (
        typeof body.homeTeamSeason === 'string' &&
        typeof body.homeTeamName === 'string' &&
        typeof body.awayTeamSeason === 'string' &&
        typeof body.awayTeamName === 'string'
    );
}

export const simulateGame = async (req: Request<{}, {}, GameRequestBody>, res: Response) => {
    try {
        if (!isValidGameRequest(req.body)) {
            return res.status(400).json({ message: 'All parameters must be strings.' });
        }
        const {sport, homeTeamSeason, homeTeamName, awayTeamSeason, awayTeamName} = req.body;
        const matchId: number = await createMatchUp(
            sport,
            homeTeamSeason,
            homeTeamName,
            awayTeamSeason,
            awayTeamName
        );
        const gameSimulation = await generateGame(req.body);
        if (!gameSimulation) {
            return res.status(500).json({ message: 'Failed to generate game simulation.' });
        }
        await storeMatchUpResults(matchId, gameSimulation);
        await res.status(200).json({
            message: 'Parameters received successfully!',
            data:  JSON.parse(gameSimulation),
        });
    } catch (e) {
        console.error("Simulation error:", e);
        res.status(500).json({
            message: 'Internal server error.',
            error: e instanceof Error ? e.message : 'Unknown error',
        });
    }
}

export const createSimulationRecapArticle = async (req: Request, res: Response) => {
    try {
        const articleContentPrompt = await prepareSimulationRecapArticlePrompt(Number(req.params.matchUpResultId));
        const openAIArticle = await openAICLient.chat.completions.create({
            model: "gpt-4.1",
            messages: [{ role: "user", content: articleContentPrompt }],
            response_format:{type: "json_object"}
        });
        return await res.status(200).json({
            message: 'Parameters received successfully!',
            data:  openAIArticle.choices?.[0]?.message?.content ,
        });
    } catch (e) {
        console.error("Article generation error:", e);
        res.status(500).json({
            message: 'Internal server error.',
            error: e instanceof Error ? e.message : 'Unknown error',
        });
    }
}