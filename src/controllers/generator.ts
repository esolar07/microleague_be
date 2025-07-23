import { Request, Response } from 'express';
import OpenAI from 'openai';
import {createMatchUp, storeMatchUpResults} from '../services/matchUpService';
require('dotenv').config();

const openAICLient = new OpenAI();

interface GameRequestBody{
    sport: string;
    homeTeamSeason: string;
    homeTeamName: string;
    awayTeamSeason: string;
    awayTeamName: string;
}

export const sportConfigs = {
    football: {
        league: 'NFL',
        titlePrefix: 'Simulate an NFL Match',
        stats: [
            'total_yards',
            'passing_yards',
            'rushing_yards',
            'turnovers',
            'sacks_allowed',
            'time_of_possession'
        ],
        notesHint: 'Era impact notes should reflect passing rules, line play, clock mgmt.'
    },
    basketball: {
        league: 'NBA',
        titlePrefix: 'Simulate an NBA Matchup',
        stats: [
            'points',
            'assists',
            'rebounds',
            'turnovers',
            'field_goal_percentage',
            'three_point_percentage'
        ],
        notesHint: 'Era notes should address pace, 3-point usage, hand-checking.'
    },
    baseball: {
        league: 'MLB',
        titlePrefix: 'Simulate an MLB Game',
        stats: [
            'hits',
            'runs',
            'home_runs',
            'strikeouts',
            'errors',
            'innings_pitched'
        ],
        notesHint: 'Era impact should reflect pitching dominance, DH rule, ballpark size.'
    }
} as const;

export type SportKey = keyof typeof sportConfigs;
 
export function prepareSimulationRecapArticlePrompt(matchUpResultId: number) {
  
} 

export function prepareSimulationPrompt(
    sport: string,
    homeTeamSeason: string,
    homeTeamName: string,
    awayTeamSeason: string,
    awayTeamName: string
): string {
    const periodLabel: string = sport === 'baseball' ? 'inning_summaries' : 'quarter_summaries';
    const periodKey: string = sport === 'baseball' ? 'inning' : 'quarter';
    const coachLabel: string = sport === 'baseball' ? 'manager' : 'coach';
    const config = sportConfigs[sport];
    console.log(config)
    const statsSchema = config.stats.map((stat) => `\"${stat}\": [type]`).join(',\n');

    return `
      ${config.titlePrefix}: (away) ${awayTeamSeason} ${awayTeamName} at (home) ${homeTeamSeason} ${homeTeamName}.
      Use era-adjusted rules. ${config.notesHint}

      Return response as JSON:
      {
        \"game_info\": {
          \"sport\": \"${sport}\",
          \"title\": \"String\",
          \"subtitle\": \"String\",
          \"location\": \"String\",
          \"rules_adjustment\": \"String\"
        },
        \"teams\": {
          \"${homeTeamName}\": {
            \"${coachLabel}\": \"String\",
            \"actual_season_record\": \"String\",
            \"notable_players\": [\"String\"],
            \"era_style\": \"String\"
          },
          \"${awayTeamName}\": {
            \"${coachLabel}\": \"String\",
            \"actual_season_record\": \"String\",
            \"notable_players\": [\"String\"],
            \"era_style\": \"String\"
          }
        },
        \"${periodLabel}\": [
          {
            \"${periodKey}\": Number,
            \"highlights\": [\"String\"],
            \"score\": \"String\"
          }
        ],
        \"final_score\": \"String\",
        \"game_statistics\": {
          \"${homeTeamName}\": {
            \"team_name\": \"${homeTeamName}\",
            ${statsSchema}
          },
          \"${awayTeamName}\": {
            \"team_name\": \"${awayTeamName}\",
            ${statsSchema}
          }
        },
        \"era_impact_notes\": [\"String\"],
        \"MVP\": {
          \"name\": \"String\",
          \"stats\": \"String\",
          \"summary\": \"String\"
        }
      }`;
}

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
    // const matchUpResultId = parseInt(req.query.matchUpResultId as string, 10);
    // if (isNaN(matchUpResultId)) {
    //     return res.status(400).json({ message: 'Invalid matchUpResultId parameter.' });
    // }
    // try {
    //     const articleContent = await prepareSimulationRecapArticlePrompt(matchUpResultId);
    //     if (!articleContent) {
    //         return res.status(500).json({ message: 'Failed to generate article content.' });
    //     }
    //     res.status(200).json({
    //         message: 'Article generated successfully!',
    //         data: articleContent,
    //     });
    // } catch (e) {
    //     console.error("Article generation error:", e);
    //     res.status(500).json({
    //         message: 'Internal server error.',
    //         error: e instanceof Error ? e.message : 'Unknown error',
    //     });
    // }
}