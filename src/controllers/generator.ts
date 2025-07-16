import { Request, Response } from 'express';
import OpenAI from 'openai';
require('dotenv').config();

const openAICLient = new OpenAI();

interface GameRequestBody{
    homeTeamSeason: string;
    homeTeamName: string;
    awayTeamSeason: string;
    awayTeamName: string;
}

function preparePrompt(homeTeamSeason: string, homeTeamName:string, awayTeamSeason: string, awayTeamName: string) {
    return `Simulate an NFL Match: (away) ${awayTeamSeason} ${awayTeamName} at  (home) ${homeTeamSeason} ${homeTeamName }.Detailed, Era-Balanced Gridiron Showdown. 
    Response must be returned in the following structured JSON format: {
            "game_info": {
                "title": String,
                "subtitle": String,
                "location": String,
                "rules_adjustment": String
            },
            "teams": {
                {home_team_name}: {
                    "coach": String,
                    "actual_season_record": String,
                    "notable_players": Array ,
                    "era_style": String
                },
                {away_team_name}: {
                    "coach": String,
                    "actual_season_record": String,
                    "notable_players": Array ,
                    "era_style": String
                }
            },
            "quarter_summaries": [
                {
                    "quarter": Int,
                    "highlights": Array,
                    "score": String
                },
            ],
            "final_score": String,
            "game_statistics": {
                {home_team_name}: {
                    "team_name": String
                    "total_yards": Int,
                    "passing_yards": Int,
                    "rushing_yards": Int,
                    "turnovers": Int,
                    "sacks_allowed": Int,
                    "time_of_possession": String
                },
                {away_team_name}: {
                    "team_name": String
                    "total_yards": Int,
                    "passing_yards": Int,
                    "rushing_yards": Int,
                    "turnovers": Int,
                    "sacks_allowed": Int,
                    "time_of_possession": String
                },
            },
            "era_impact_notes":Array,
            "MVP": {
                "name": String,
                "stats": String,
                "summary": String           
            }
        }`;
}

async function generateGame(homeTeamSeason: string, homeTeamName:string, awayTeamSeason: string, awayTeamName: string) {
    const response = await openAICLient.chat.completions.create({
        model: "gpt-4.1",
        messages: [{ role: "user", content: preparePrompt(homeTeamSeason, homeTeamName, awayTeamSeason, awayTeamName) }],
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
        const {homeTeamSeason, homeTeamName, awayTeamSeason, awayTeamName} = req.body;
        if (!isValidGameRequest(req.body)) {
            return res.status(400).json({ message: 'All parameters must be strings.' });
        }
        const gameSimulation = await generateGame(homeTeamSeason, homeTeamName, awayTeamSeason, awayTeamName);
        console.log(gameSimulation)
        // const cleanedGameSimulation = gameSimulation
        //     .replace(/^```json\n/, '')  // Remove starting ```json
        //     .replace(/\n```$/, '');     // Remove trailing ```
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