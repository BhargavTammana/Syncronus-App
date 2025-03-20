import { getMessages } from '../controllers/MessagesController.js'
import {Router} from 'express'
import {verifyToken} from '../middlewares/AuthMiddleware.js'


const messagesRoutes = Router()

messagesRoutes.post("/get-messages",verifyToken,getMessages)


export default messagesRoutes