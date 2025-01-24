import express from 'express';
import cookieParser from "cookie-parser"
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config({
    path :"./.env"
})
const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit : '20kb'}))
app.use(express.urlencoded({ extended: true , limit : '20kb' }))
app.use(express.static('Public'))
app.use(cookieParser())

// routes import 
import userRouter from './routes/User.route.js'
import videoRouter from './routes/Video.route.js'
import playlistRouter from './routes/Playlist.route.js'
import subcriberRouter from './routes/Subcription.route.js'

// routes decleration 
app.use('/api/v1/users' , userRouter)
app.use('/api/v1/videos' ,videoRouter )
app.use('/api/v1/playlist', playlistRouter)
app.use('/api/v1/subcriber' , subcriberRouter)

export { app }