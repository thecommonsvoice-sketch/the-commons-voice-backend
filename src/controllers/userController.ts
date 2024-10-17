import { NextFunction,Request,Response } from "express";

export const getUsers = (req:Request, res:Response,next:NextFunction)=>{

    const users:string[] = ['a','c','d'
    ];

    res.json({
        users
    })

}