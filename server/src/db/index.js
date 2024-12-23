import mongoose from "mongoose";
import { DB_Name } from '../Constant.js'
import express from "express";

export const ConnectDB = async () => {
    try {     
       const monogbconnect =  await mongoose.connect(`${process.env.MONOGODB_URL}/${DB_Name}`)
       console.log(`mongodb is connected !!` , monogbconnect.connection.host)  
    }
    catch (error) {
        console.error('MONOGODB CONNECTION FAILED ', error) 
        process.exit(1)   
    
    }
}
