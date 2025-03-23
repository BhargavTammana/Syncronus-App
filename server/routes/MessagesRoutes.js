import { getMessages } from '../controllers/MessagesController.js'
import {Router} from 'express'
import {verifyToken} from '../middlewares/AuthMiddleware.js'
import multer from "multer"

const messagesRoutes = Router()
const upload = multer({dest:"uploads/files"})
messagesRoutes.post("/get-messages",verifyToken,getMessages)


export default messagesRoutes