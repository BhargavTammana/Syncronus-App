import { Router } from "express";
import { searchContacts } from "../controllers/ContactsController";
import { verifyToken } from "../middlewares/AuthMiddleware";

const contactRoutes = Router()

contactRoutes.post("/search",verifyToken,searchContacts)

export default contactRoutes;