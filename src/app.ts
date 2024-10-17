import express from "express"
import userRoute from "./routers/user.js"

const app = express();

app.use("/user",userRoute);


app.get("/",(req,res)=>{

    res.send("<head><style>h1{color:red;}</style></head><h1>lol bhai jaan</h1>");

})

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})