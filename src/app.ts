import express from "express"
import db from "./data/dbs.js";
import userRoute from "./routers/user.js"

// connecting database
db();

const app = express();

// to use req.body
app.use(express.json())

//  user routes
app.use("/user",userRoute);


app.get("/",(req,res)=>{

    res.send("<head><style>h1{color:red;}</style></head><h1>lol bhai jaan</h1>");

})

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})