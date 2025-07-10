import {Router} from 'express'
import {simulateGame} from "./controllers/generator";
import {getSeasonBySport, getTeamsBySeason} from "./controllers/teams";



const router = Router()
router.get('/home', (req, res)=> {
    res.json({message: 'home'})
});
router.post('/generate', simulateGame)
router.get('/seasons/:sport', getSeasonBySport)
router.get('/seasons/:sport/:season', getTeamsBySeason)
export default router