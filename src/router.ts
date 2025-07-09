import {Router} from 'express'
import {simulateGame} from "./controllers/generator";
import {getSeasonBySport} from "./controllers/teams";



const router = Router()
router.get('/home', (req, res)=> {
    res.json({message: 'home'})
});
router.post('/generate', simulateGame)
router.get('/seasons/:sport', getSeasonBySport)
export default router