import express from "express"
import db from "./data/dbs.js";
import userRoute from "./routers/user.js"
import { config } from "dotenv";
import {dirname} from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)


config({
    path: `${__dirname}/data/config.env`,
    
})


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
app.listen(process.env.PORT,()=>{
    console.log("Server is running on port:",process.env.PORT);
})