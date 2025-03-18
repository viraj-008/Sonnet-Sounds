import express from 'express';
import AiController from '../controllers/aiSongController.js'
import {callBack} from '../controllers/aiSongController.js'
import {getStatus} from '../controllers/aiSongController.js'
import {authenticateUser} from '../middleware/middleware.js'
const router = express.Router();

router.post('/gen',authenticateUser,AiController);
router.post('/callB',authenticateUser,callBack);
router.get('/status',getStatus);

export default router;
