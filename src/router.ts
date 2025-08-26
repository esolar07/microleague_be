import {Router} from 'express'
import {simulateGame, createSimulationRecapArticle} from "./controllers/generator";
import {getSeasonBySport, getTeamsBySeason} from "./controllers/teams";
import {fetchMatchUpDetails} from "./controllers/matchup";


const router = Router()
router.get('/home', (req, res)=> {
    res.json({message: 'home'})
});
router.post('/generate', simulateGame)
router.get('/seasons/:sport', getSeasonBySport)
router.get('/seasons/:sport/:season', getTeamsBySeason)
router.get('/fetch/details/:matchUpResultId', fetchMatchUpDetails)
router.get('/generate/articles/:matchUpResultId', createSimulationRecapArticle)

export default router