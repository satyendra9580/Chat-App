import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {renameSync,unlinkSync} from "fs";

const maxAge=10*24*60*60*1000;
const createToken=(email,userId)=>{
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge})
};
export const signup=async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).send("Email and Password is required");
        }
        const user=await User.create({email,password}); 
        res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });
        return res.status(201).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup
            }
        })
    }catch(err){
        console.log({err});
        return res.status(500).send("Internal Server Error");
    }
}
export const login=async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).send("Email and Password is required");
        }
        const user=await User.findOne({email});
        if(!user) return res.status(404).send("User with given email is not found");
        const auth=await compare(password,user.password);
        if(!auth) return res.status(400).send("Password is Incorrect");

        res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });
        return res.status(200).json({
            user:{
                id:user.id,
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                color:user.color,
                profileSetup:user.profileSetup
            }
        })
    }catch(err){
        console.log({err});
        return res.status(500).send("Internal Server Error");
    }
}

export const getUserInfo=async (req,res,next)=>{
    try{
        const userData=await User.findById(req.userId);
        if(!userData) return res.status(401).send("User with given Id is not found.");

        return res.status(200).json({
                id:userData.id,
                email:userData.email,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
                color:userData.color,   
                profileSetup:userData.profileSetup 
        })
    }catch(err){
        console.log({err});
        return res.status(500).send("Internal Server Error");
    }
}

export const updateProfile=async (req,res,next)=>{
    try{
        const {userId}=req;
        const {firstName,lastName,color}=req.body;
        if(!firstName || !lastName) return res.status(400).send("FirstName LstName and color is required.");

        const userData=await User.findByIdAndUpdate(
            userId,{
                firstName,lastName,color,profileSetup:true,
            },
            {new:true,newValidators:true}
        );

        return res.status(200).json({
                id:userData.id,
                email:userData.email,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
                color:userData.color,   
                profileSetup:userData.profileSetup 
        })
    }catch(err){
        console.log({err});
        return res.status(500).send("Internal Server Error");
    }
}

export const addProfileImage=async (req,res,next)=>{
    try{
        if(!req.file){
            return res.status(400).send("File is required.");
        }
        const date=Date.now();
        let fileName="uploads/profiles/"+date+req.file.originalname;
        renameSync(req.file.path,fileName);

        const updatedUser=await User.findByIdAndUpdate(req.userId,{image:fileName},{new:true,runValidators:true});

        return res.status(200).json({
            image:updatedUser.image,
        })
    }catch(err){
        console.log({err});
        return res.status(500).send("Internal Server Error");
    }
}

export const removeProfileImage=async (req,res,next)=>{
    try{
        const {userId}=req;
        const user=await User.findById(userId);
        if(!user){
            return response.status(400).send("User not found.");
        }
        if(user.image){
            unlinkSync(user.image);
        }
        user.image=null;
        await user.save();

        return res.status(200).send("Profile image remove successfully.");
    }catch(err){
        console.log({err});
        return res.status(500).send("Internal Server Error");
    }
}
export const logout = async (request, response, next) => {
    try {
      response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
      return response.status(200).send("Logout successful");
    } catch (err) {
      return response.status(500).send("Internal Server Error");
    }
  };