import {Router} from 'express'
import {simluateGame} from "./controllers/generator";



const router = Router()
router.post('/generate', simluateGame)

export default router