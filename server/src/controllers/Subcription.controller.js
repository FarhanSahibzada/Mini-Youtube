import { Subcription } from "../modal/Subcription.modal.js";
import { Asynchandler } from "../utils/Asynchandler.js";
import { ApiError } from "../utils/APIerror.js";
import { ApiResponse } from "../utils/APIResponse.js";
import mongoose from "mongoose";



const toggleSubcription = Asynchandler(async (req, res) => {
    const { channelId } = req.params;
    const subcriberId = req.user?._id;

    if (!channelId && !subcriberId) {
        throw new ApiError(401, "can not get the channel id");
    }

    const existsubcriber = await Subcription.findOne({ subscriber: subcriberId, channel: channelId })


    if (existsubcriber) {
        await Subcription.deleteOne({ _id: existsubcriber._id });

        return res.status(200).json(new ApiResponse(200, "Unsubscribed successfully"));
    } else {

        await Subcription.create({
            subscriber: subcriberId,
            channel: channelId
        });

        return res.status(200).json(new ApiResponse(200, "Subscribed successfully"));
    }

})


const getSubcriberVideos = Asynchandler(async (req, res) => {
    const subcriberId = req.user?._id;

    if (!subcriberId) {
        throw new ApiError(500, "can not get the subcriber");
    }
   
    const Data = await Subcription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subcriberId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "channel",
                foreignField: "owner",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        avatar: 1,

                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
   ])

    console.log(Data)

    return res
    .status(200)
    .json(new ApiResponse(200 , Data , "successfully get the data"))

})



export {
    toggleSubcription,
    getSubcriberVideos
}