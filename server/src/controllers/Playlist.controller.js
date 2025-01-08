import { Playlist } from "../modal/Playlist.modal.js";
import { Asynchandler } from "../utils/Asynchandler.js";
import { ApiError } from "../utils/APIerror.js";
import { ApiResponse } from "../utils/APIResponse.js";
import mongoose from "mongoose";

const createPlaylist = Asynchandler(async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        throw new ApiError(400, "Please Write the name and description of the playlist")
    }

    const playlists = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    const playlist = await Playlist.findById(playlists._id)

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist is created successfully!"))
})

const getUserPlaylist = Asynchandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "Please provide the user Id")
    }
    const playlist = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        }
        
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist is fetched successfully!"))
})

const getPlaylistById = Asynchandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Please provide the playlist Id")
    }
    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist is fetched successfully!"))
})

const addVideoToPlaylist = Asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Please provide the playlist Id and video Id")
    }
    if (!mongoose.Types.ObjectId.isValid(videoId) || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlistId or videoId");
    }


    const playlist = await Playlist.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(playlistId) },
        {
            $addToSet: {
                videos: new mongoose.Types.ObjectId(videoId)
            }
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video is added to the playlist successfully!"))
})

const removeVideoFromPlaylist = Asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Please provide the playlist Id and video Id")
    }

    const playlist = await Playlist.updateOne(
        { _id: new mongoose.Types.ObjectId(playlistId) },
        {
            $pull: {
                videos: new mongoose.Types.ObjectId(videoId)
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video is removed from the playlist successfully!"))
})

const deletePlaylist = Asynchandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId) {
        throw new ApiError(400, "Please provide the playlist Id")
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist is deleted successfully!"))
})


export {
    createPlaylist,
    getUserPlaylist,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist
}