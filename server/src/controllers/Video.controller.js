import { Video } from "../modal/Video.modal.js";
import { ApiError } from '../utils/APIerror.js';
import { ApiResponse } from '../utils/APIResponse.js';
import { RemoveOldImageFromCloudinary, UploadOnCloudinary, } from '../Service/Cloudinary.js';
import { Asynchandler } from "../utils/Asynchandler.js";
import mongoose from "mongoose";
import { User } from "../modal/User.modal.js";


const getAllVideos = Asynchandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc", userId } = req.query;
    if (!userId) {
        throw new ApiError(400, "can not gettting the userId ");
    }
  
    const pipeline = [
        {
            $match: { owner: new mongoose.Types.ObjectId(userId) }
        },
        {
            $sort: {
                [sortBy]: sortType === 'asc' ? 1 : -1
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: "owner",
                foreignField: "_id",
                as: 'ownerDetails',
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        { $unwind: "$ownerDetails" } // Correct syntax for $unwind
    ];

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const video = await Video.aggregatePaginate(Video.aggregate(pipeline), options);

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Videos fetched successfully"));
})

const publishVideo = Asynchandler(async (req, res) => {
    const { title, description } = req.body;
    if (
        [title, description].some((field) => field?.trim() == "")
    ) {
        throw new ApiError(400, "Can't get the video data");
    }
    const videofile = req.files?.VideoFile[0]?.path;
    const thumbnailfile = req.files?.thumbnail[0]?.path;
    if (!(videofile && thumbnailfile)) {
        throw new ApiError(400, "can't not get the files");
    }
    const videoFile = await UploadOnCloudinary(videofile)
    const thumbnail = await UploadOnCloudinary(thumbnailfile)
    if (!(videoFile && thumbnail)) {
        throw new ApiError(400, "can't not get the files link from cloudinary");
    }
    const user = await User.findById(req.user?._id).select("-passowrd -resfreshToken")

    const video = await Video.create({
        videoFile: {
            url: videoFile?.url,
            public_Id: videoFile.public_id
        },
        thumbnail: {
            url: thumbnail?.url,
            public_Id: thumbnail.public_id
        },
        title,
        description,
        views: 0,
        duration: videoFile?.duration,
        ispublish: true,
        owner: user
    })
    const createdVideo = Video.findById(video._id)

    if (createdVideo) {
        throw new ApiError(500, "something went while registering the user");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdVideo, "Video is Successfully upload!"))
})

const getVideoById = Asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const Videoo = await Video.findById(videoId)
    if (!Videoo) {
        throw new ApiError(400, "Can't get the vidoe please try again");
    }

    await Promise.all([
        Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }),
        User.findByIdAndUpdate(req.user?._Id, { $addToSet: { watchHistory: videoId } })
    ]);

    return res.
        status(200)
        .json(new ApiResponse(200, Videoo, "Video is completely uploaded!"))
})

const updateVideo = Asynchandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(200, "can't match the video id");
    }
    const { title, description } = req.body;
    if (
        [title, description].some((field) => field?.trim() == "")
    ) {
        throw new ApiError(400, "Please fill the fields");
    }
    const videofile = req.files?.VideoFile[0]?.path;
    const thumbnailfile = req.files?.thumbnail[0]?.path;
    if (!(videofile && thumbnailfile)) {
        throw new ApiError(400, "can't not get the files");
    }
    const videoFile = await UploadOnCloudinary(videofile)
    const thumbnail = await UploadOnCloudinary(thumbnailfile)
    if (!(videoFile && thumbnail)) {
        throw new ApiError(400, "can't not get the files link from cloudinary");
    }
    const oldvideo = video.videoFile;
    const oldthumbnail = video.thumbnail;

    video.title = title;
    video.description = description;
    video.videoFile = {
        url: videoFile?.url,
        public_Id: videoFile.public_id
    }
    video.thumbnail = {
        url: thumbnail?.url,
        public_Id: thumbnail.public_id
    };
    video.duration = videoFile?.duration;

    await video.save();

    if (oldvideo) {
        await RemoveOldImageFromCloudinary(videoFile)
        await RemoveOldImageFromCloudinary(oldthumbnail)
    } else {
        throw new ApiError(500, "old avatar link is not found try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, Video, "video is successfully updated!"))

})

const deleteVideo = Asynchandler(async (req, res) => {
    const { videoId } = req.params;

    // Find the video by its ID
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.videoFile.url) {
        await RemoveOldImageFromCloudinary(video.videoFile)
    }
    if (video.videoFile.thumbnail) {
        await RemoveOldImageFromCloudinary(video.thumbnail)
    }

    // Delete the video from the database
    await Video.findByIdAndDelete(videoId);

    return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
});


export {
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo
}