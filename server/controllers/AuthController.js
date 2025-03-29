import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'
import { compare } from 'bcryptjs';
import {renameSync,unlinkSync} from "fs"
const maxAge= 3*24*60*60*1000;

const createToken=(email,userId)=>{
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge})
}


export const signup = asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body
    if(!email || !password){
        res.status(400).send("Email and Password is required.")
    }
    const user = await User.create({email,password})
    res.cookie("jwt",createToken(email,user.id),{
        maxAge,
        secure:true,
        sameSite:"None"
    })
    res.status(201).json({user:{
        id:user.id,
        email:user.email,
        profileSetup:user.profileSetup
    }})
})


export const login = asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(400).send("Email and Password is required.")
    }
    const user = await User.findOne({email}).select('+password')
    if(!user){
        return res.status(404).send("Invalid email")
    }
    const result = await compare(password,user.password)
    
    if(!result){
        return res.status(401).send("Invalid email or password")
    }

    res.cookie("jwt",createToken(email,user.id),{
        maxAge,
        secure:true,
        sameSite:"None"
    })
    return res.status(200).json({user:{
        id:user.id,
        email:user.email,
        profileSetup:user.profileSetup,
        firstName:user.firstName,
        lastName:user.lastName,
        image:user.image,
        color:user.color
    }})
})

export const getUserInfo = asyncHandler(async(req,res,next)=>{    
    const userData = await User.findById(req.userId)
    if(!userData) {return res.status(404).send("User with Id not found")}
    res.status(200).json({
        id:userData.id,
        email:userData.email,
        profileSetup:userData.profileSetup,
        firstName:userData.firstName,
        lastName:userData.lastName,
        image:userData.image,
        color:userData.color
   })
})

export const updateProfile = asyncHandler(async(req,res,next)=>{
    const {userId} = req
    const{firstName,lastName,color} = req.body   
    if(!firstName || !lastName) {return res.status(400).send("FirstName and LastName is required")}
    const userData = await User.findByIdAndUpdate(userId,{firstName,lastName,color,profileSetup:true},{new:true,runValidators:true})
    res.status(200).json({
        id:userData.id,
        email:userData.email,
        profileSetup:userData.profileSetup,
        firstName:userData.firstName,
        lastName:userData.lastName,
        image:userData.image,
        color:userData.color
   })
})

export const addProfileImage = asyncHandler(async(req,res,next)=>{
    if(!req.file) return res.status(400).send("File is required")
    const date = Date.now()
    let fileName = "uploads/profiles/"+date+req.file.originalname
    renameSync(req.file.path, fileName);
    const updatedUser = await User.findByIdAndUpdate(req.userId,{image:fileName},{new:true,runValidators:true})
    
    res.status(200).json({
        image:updatedUser.image,
   })
})


export const removeProfileImage = asyncHandler(async(req,res,next)=>{
    const {userId} = req
    const user = await User.findById(userId)
    if(!user) return res.status(400).send("User with Id not found")
    if(user.image){
    unlinkSync(user.image)
    }

    user.image = null

    await user.save()
    res.status(200).send("Profile Image removed successfully")
})

export const logout = asyncHandler(async(req,res,next)=>{
    res.cookie("jwt",{},{
        maxAge:1,
        secure:true,
        sameSite:"None"
    })
    res.status(200).send("Logout successfully")
})