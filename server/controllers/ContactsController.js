import expressAsyncHandler from "express-async-handler"
import User from "../models/UserModel.js"
import mongoose from "mongoose"
import Message from "../models/MessagesModel.js"
import Channel from "../models/ChannelModel.js"

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

export const getContactsForDMList = expressAsyncHandler(async(req,res,next)=>{
    let {userId} = req
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
        {
            $match:{
                $or:[{ sender:userId},{recipient:userId}],
            },
        },
        {
            $sort:{timeStamp:-1},
        },
        {
            $group:{
                _id:{
                    $cond:{
                        if:{$eq:["$sender",userId]},
                        then:"$recipient",
                        else:"$sender",
                    }
                },
                lastMessageTime:{$first:"$timeStamp"},
            },
        },
        {
            $lookup:{
                from:"users",
                localField:"_id",
                foreignField:"_id",
                as:"contactInfo",
            }
        },
        {
            $unwind:"$contactInfo"
        },
        {
            $project:{
                _id:1,
                lastMessageTime:1,
                email:"$contactInfo.email",
                firstName:"$contactInfo.firstName",
                lastName:"$contactInfo.lastName",
                image: "$contactInfo.image",
                color:"$contactInfo.color"
            }
        },
        {
            $sort:{lastMessageTime:-1}
        }
    ])
    
    return res.status(200).json({contacts})
})

export const getAllContacts = expressAsyncHandler(async(req,res,next)=>{
    const users = await User.find({_id:{$ne:req.userId}},"firstName lastName _id")

    const contacts = users.map((user)=>({
        label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
        value: user._id,
    }))
    return res.status(200).json({contacts})
})

