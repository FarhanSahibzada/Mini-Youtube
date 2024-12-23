import mongoose from "mongoose";


const playlistSchema = new mongoose.Schema({
    name: {
        type: string,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true })


const Playlist = mongoose.model("Playlist", playlistSchema)