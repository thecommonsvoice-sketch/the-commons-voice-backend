import mongoose from "mongoose";

export default function db(){
    mongoose.connect("mongodb://0.0.0.0:27017",{
        dbName:"demobase"
    }).then(()=>{
        console.log("data base is connected...")
    }).catch((e)=>{console.log(e)})
}