import { NextFunction,Request,Response } from "express";
import User, { IUser } from "../models/userModel.js";

export const getUsers =  async(req:Request, res:Response,next:NextFunction)=>{

    // const users:string[] = ['a','c','d'
    // ];

    let users:IUser[] = await User.find({});
    console.log(users)


    res.json({
        success:true,
        users
    })

}


export const createUser = async(req:Request, res:Response,next:NextFunction)=>{

    // const {name,email} = req.body;
    const { name,email } = req.body

    await User.create({
        name,
        email
    });

     res.json({
        success:true,
        message:'User created successfully'
    })

}