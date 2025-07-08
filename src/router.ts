import {Router} from 'express'
import {simulateGame} from "./controllers/generator";



const router = Router()
router.get('/home', (req, res)=> {
    res.json({message: 'home'})
});
router.post('/generate', simulateGame)

export default router