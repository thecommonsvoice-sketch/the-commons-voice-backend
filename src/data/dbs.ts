import mongoose from "mongoose";

export default function db(){

    mongoose.connect(process.env.DB_URL!,{
        dbName:"demobase"
    }).then(()=>{
        console.log("data base is connected...")
    }).catch((e)=>{console.log(e)})
}