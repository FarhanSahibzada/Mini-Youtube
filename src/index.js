import mongoose from "mongoose";
import { ConnectDB } from "./db/index.js";
import  dotenv from 'dotenv'
import { app } from "./app.js";
dotenv.config({ 
    path:'./env'
})


ConnectDB()
.then(()=> {
    app.listen(process.env.PORT || 8000 , ()=> {
        console.log(`server is running at port :`, process.env.port)
    })
})
.catch((error)=> {
    console.log('mongodb connection failed')
})

