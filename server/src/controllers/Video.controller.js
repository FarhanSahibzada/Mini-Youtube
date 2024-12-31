import { Video } from "../modal/Video.modal.js";
import { ApiError } from '../utils/APIerror.js';
import { ApiResponse } from '../utils/APIResponse.js';
import { UploadOnCloudinary, } from '../Service/Cloudinary.js';
import { Asynchandler } from "../utils/Asynchandler.js";




const publishVideo = Asynchandler(async (req , res) =>{
    const {title  , description } = req.body ;
    if(
        [title , description].some((field)=> field?.trim() == "")
    ){
        throw new ApiError(400 , "Can't get the video data");   
    }
    const videofile = req.files?.VideoFile[0]?.path;
    const thumbnailfile = req.files?.thumbnail[0]?.path;
    if(!(videofile && thumbnailfile)){
        throw new ApiError(400 , "can't not get the files");
    }
    const videoFile = await UploadOnCloudinary(videofile)
    const thumbnail = await UploadOnCloudinary(thumbnailfile)
    if(!(videoFile && thumbnail)){
        throw new ApiError(400 , "can't not get the files link from cloudinary");
    }

    const video = await Video.create({
        videoFile : videoFile?.url,
        thumbnail : thumbnail?.url,
        title,
        description,
        views : 0 ,
        duration : '',
        ispublish: true ,
        owner :  ''
    })
    const createdVideo = Video.findById(video._id)
    
    if (createdVideo) {
        throw new ApiError(500, "something went while registering the user");
    }

    return res 
    .status(200)
    .json(new ApiResponse(200 , createdVideo ,"Video is Successfully upload!"))

})