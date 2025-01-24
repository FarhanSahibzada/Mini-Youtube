import { Video } from "../modal/Video.modal.js";
import { ApiError } from '../utils/APIerror.js';
import { ApiResponse } from '../utils/APIResponse.js';
import { RemoveOldImageFromCloudinary, UploadOnCloudinary, } from '../Service/Cloudinary.js';
import { Asynchandler } from "../utils/Asynchandler.js";
import mongoose from "mongoose";
import { User } from "../modal/User.modal.js";


const getAllVideos = Asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query ="", sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const pipeline = [];

    if (userId) {
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        })
    }

    if (query) {
        pipeline.push({
            $match: {
                title: { $regex: query, $options: "i" }
            }
        })
    }
    pipeline.push({
        $sort: {
            [sortBy]: sortType == 'asc' ? 1 : -1
        }
    })

    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerDetails",
            pipeline: [
                {
                    $project: {
                        username: 1,
                        avatar: 1
                    }
                }
            ]
        }
    }
    )
    pipeline.push({
        $unwind: "$ownerDetails"
    })

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
    const videofile = req.files?.videoFile[0]?.path;
    const thumbnailfile = req.files?.thumbnail[0]?.path;

    if (!videofile || !thumbnailfile) {
        throw new ApiError(400, "can't not get the files");
    }
    const videoFile = await UploadOnCloudinary(videofile)
    const thumbnail = await UploadOnCloudinary(thumbnailfile)

    if (!videoFile || !thumbnail) {
        throw new ApiError(400, "can't not get the files link from cloudinary");
    }
    const user = req.user._id;

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

    const createdVideo = await Video.findById(video._id).select(" -ispublish")

    if (!createdVideo) {
        throw new ApiError(500, "something went while registering the user");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdVideo, "Video is successfully uploaded!"))
})

const getVideoById = Asynchandler(async (req, res) => {
    const { videoId } = req.params;

    await Video.updateOne(
        { _id: videoId },
        { $inc: { views: 0.5 }, }
    )

    await User.updateOne(
        { _id: req.user?._id },
        { $addToSet: { watchHistory:  videoId } }
    );

    const Videos = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $lookup: {
                            from: "subcriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "Subscribers",
                        }
                    },
                    {
                        $addFields: {
                            SubcriberCount: {
                                $size: "$Subscribers"
                            },
                            isSubcribed: {
                                $cond: {
                                    if: { $in: [req.user?._id, "$Subscribers.subscriber"] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            SubcriberCount: 1,
                            isSubcribed: 1,
                        }
                    }
                ]

            },
        },
        {
            $unwind: "$ownerDetails"
        }
    ])



    return res.
        status(200)
        .json(new ApiResponse(200, Videos, "Video is completely fetched!"))
})

const updateVideo = Asynchandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body;

    if (
        [title, description].some((field) => field?.trim() == "")
    ) {
        throw new ApiError(400, "Please fill the fields");
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description
            }
        }
        ,
        { new: true }
    )


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

    return res.status(200).json(new ApiResponse(200, true, "Video deleted successfully"));
});


export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo
}