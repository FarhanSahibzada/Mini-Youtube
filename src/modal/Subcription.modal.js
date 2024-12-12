import mongoose, { Schema } from "mongoose";


const subcriptionSchrma = new mongoose.Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // who subscribe the channel
        ref: "User"

    },
    channel: {
        type: Schema.Types.ObjectId, // that men who have the channel
        ref: "User"
    }

}, { timestamps: true })


export const Subcription = mongoose.model("Subcription", subcriptionSchrma)