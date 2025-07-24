import { getMatchUpResults } from '../services/matchUpService';

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


export async function prepareSimulationRecapArticlePrompt(matchUpResultId: number) {
    const matchSimulationResults: any = await getMatchUpResults(matchUpResultId);
    if (!matchSimulationResults) {
        throw new Error(`No simulation results found for matchUpResultId: ${matchUpResultId}`);
    }
    return `
        You are a sports journalist writing for MicroLeague Sports Insider, covering a simulated 
        game between two teams or players from different eras.
         
        Write a full-length media-style article (700–1,000 words) that covers the simulated 
        matchup as if it were real. The tone should match outlets like ESPN, The Athletic, or 
        Bleacher Report — blending stats, storytelling, and sharp commentary.

        Use the following simulation results as the basis for your article:
        ${JSON.stringify(matchSimulationResults, null, 2)}

        Return response as JSON:
        {
            \"game_info\": {
                \"headline\": \"String\",
                \"image\": \"String\",
            },
            \"opening_paragraph\": {
                \"content\": \"String\",
            },
            \"game_summary\": {
                \"final_score\": \"String\",
                \"key_stats\": [\"String\"],
                \"score\": \"String\",
                \"era_impact_notes\": [\"String\"],
                \"simulation_engine_notes\": {
                    \"era_adjustments\": \"String\",
                    \"simulation_methodology\": \"String\"
                }
            },
            \"player_spotlight\": {
                \"MVP\": {
                    \"name\": \"String\",
                    \"stats\": \"String\",
                    \"summary\": \"String\"
                },
                \"notable_players\": [
                    {
                    \"name\": \"String\",
                    \"stats\": \"String\",
                    \"impact\": \"String\"
                    }
                ],
            },
            \"whats_next\": [\"String\"],
        }
    `;
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