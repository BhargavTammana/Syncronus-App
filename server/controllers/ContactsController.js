import expressAsyncHandler from "express-async-handler"
import User from "../models/UserModel.js"

export const searchContacts = expressAsyncHandler(async(req,res,next)=>{
    const {searchTerm} = req.body

    if(searchTerm === undefined || searchTerm === null){
        return res.status(400).send("Search term is required")
    }

    const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")
    const regex = new RegExp(sanitizedSearchTerm, "i")
    const contacts = await User.find({$and:[{_id:{$ne:req.userId}},{$or:[{firstName:regex},{lastName:regex},{email:regex}]}]})

    return res.status(200).json({contacts})
})