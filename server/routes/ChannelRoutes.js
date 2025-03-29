import { Router } from "express";
import { createChannel, getUserChannels } from "../controllers/ChannelController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const channelRoutes = Router()

channelRoutes.post("/create-channel",verifyToken,createChannel)
channelRoutes.get("/get-user-channels",verifyToken,getUserChannels)
export default channelRoutes
