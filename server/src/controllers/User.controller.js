import { Asynchandler } from '../utils/Asynchandler.js'
import { ApiError } from '../utils/APIerror.js';
import { User } from '../modal/User.modal.js'
import { UploadOnCloudinary, RemoveOldImageFromCloudinary } from '../Service/Cloudinary.js';
import { ApiResponse } from '../utils/APIResponse.js'
import jwt from "jsonwebtoken"
import mongoose from 'mongoose';

const generateAccessTokenAndResfreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const AccessToken = user.generatedAccessToken()
        const RefrehToken = user.generatedRefreshToken()
        user.refeshToken = RefrehToken;
        await user.save({ validateBeforeSave: false })

        return {
            AccessToken,
            RefrehToken
        }
    } catch (error) {
        throw new ApiError(500, "Something Went Wrong while Generating Access and Refreh token");

    }
}

const registerUser = Asynchandler(async (req, res) => {
    // steps 
    // get the  user data from front-end   
    // validation -- not empty
    // check if the user is already exist , username email
    // check for images , user avatar
    //upload them to cloudinary and get url
    // create user object -- entry in db
    // remove password and refresh token field from response 
    // check for user response
    //return  response

    const { username, email, password } = req.body;

    if (
        [username, email, password].some((field) => field?.trim() == "")
    ) {
        throw new ApiError(409, 'All fields are required ');
    }

    const existedUser = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (existedUser) {
        throw new ApiError(409, 'User with username and email is already exist  ')
    }

    const avatarfilepath = req.files?.avatar[0]?.path;

    let Coverimagepath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        Coverimagepath = req.files.coverImage[0].path;
    }


    if (!avatarfilepath) {
        throw new ApiError(400, "Avatar file is required ")
    }

    const avatar = await UploadOnCloudinary(avatarfilepath)
    const coverimage = await UploadOnCloudinary(Coverimagepath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required ")
    }

    const user = await User.create({
        avatar: avatar.url,
        coverImage: coverimage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdbyuser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdbyuser) {
        throw new ApiError(500, "something went while registering the user");
    }

    return res.status(200).json(
        new ApiResponse(200, createdbyuser, "user registered successfully")
    )

})

const loginUser = Asynchandler(async (req, res) => {
    // check if the user details  is register or not 
    // find the user 
    // password check 
    // acess and refresh token
    // send cookie



    const { email, username, password } = req.body


    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(400, "User docs not Exist")
    }

    const ispasswordValid = await user.isPasswordCorrected(password)
    if (!ispasswordValid) {
        throw new ApiError(401, "Invalid user Credientials")
    }

    const { AccessToken, RefrehToken } = await generateAccessTokenAndResfreshToken(user._id)
    const loggedInUser = await User.findOne(user._id).select("-password  -refreshToken")
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' 
    }

    return res
        .status(200)
        .cookie("accessToken", AccessToken, options)
        .cookie("refreshToken", RefrehToken, options)
        .json(new ApiResponse(
            200,
            { user: loggedInUser, AccessToken, RefrehToken },
            "User Logged In Successfully"
        ))
})

const logoutUser = Asynchandler(async (req, res) => {
    User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' 
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logout Successfully "))
})

const refreshAccessToken = Asynchandler(async (req, res) => {
    const Token = req.cookie?.refeshToken || req.body.refeshToken
    if (!Token) {
        throw new ApiError(401, "unAuthorized Token");
    }

    try {
        const verifyToken = jwt.verify(Token, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findOne(verifyToken?._id)
        if (!user) {
            throw new ApiError("401", "Invalid Refresh token");
        }

        if (Token != user.refreshToken) {
            throw new ApiError(401, "Refresh token is experied or used");
        }

        const { AccessToken, RefrehToken } = await generateAccessTokenAndResfreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", AccessToken, options)
            .cookie("refreshToken", RefrehToken, options)
            .json(
                new ApiResponse(
                    200,
                    { AccessToken, RefrehToken },
                    "Access token refreshed"
                )
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token");
    }
})

const changeCurrentPassword = Asynchandler(async (req, res) => {
    // steps
    // get old and new passowrd from rewq.body
    // then get user id from middleware 
    // use bycript ispasswordcorrect method to oldpassowrd and this who saved in database

    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrected(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "old password is not corrected ");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false })
    return res
        .status(200)
        .json(new ApiResponse(
            200, {}, "passowrd changed successfully"))
})

const getCurrentUser = Asynchandler(async (req, res) => {
    //return  console.log(req.user)
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req?.user,
            "currentUser was found "
        ))
})

const updateDetails = Asynchandler(async () => {
    const { fullName, email } = req.body;
    if (!fullName || !email) {
        throw new ApiError(401, "Something was wrong");
    }
    const userUpdate = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullName,
                email: email
            }
        }, {
        new: true
    }
    ).select("-passowrd")
    return res
        .status(200)
        .json(new ApiResponse(200, userUpdate, "account details updated"))
})

const updateAvatar = Asynchandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(401, "Avatar file is missing");
    }
    const avatarlink = await UploadOnCloudinary(avatarLocalPath)
    if (!avatarlink) {
        throw new ApiError(401, "Error while Uploadicng avatr");
    }

    const user = await User.findById(req.user._id)
    if (!user) {
        throw new ApiError(200, "to change avatar please log in again");
    }
    const oldAvatar = user.avatar;
    user.avatar = avatarlink.url;
    await user.save()

    if (oldAvatar) {
        return await RemoveOldImageFromCloudinary(oldAvatar)
    } else {
        throw new ApiError(500, "old avatar link is not found try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar Successfully Updated"))
})

const updateCoverIImage = Asynchandler(async (req, res) => {
    const coverLocalPath = req.file?.path;
    if (!coverLocalPath) {
        throw new ApiError(401, "Covermage  is missing");
    }
    const CoverImagelink = await UploadOnCloudinary(coverLocalPath)
    if (!CoverImagelink) {
        throw new ApiError(401, "Error while Uploadicng CoverImage");
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: CoverImagelink.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Coverimage Successfully Updated"))
});

const getChannelProfile = Asynchandler(async (req, res) => {
    const { username } = req.parmas;
    if (!username) {
        throw new ApiError(401, "User is not found ");
    }
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subcriptions",
                localField: "_id",
                foreignField: "channel",
                as: "Subcribers"
            }
        },
        {
            $lookup: {
                from: 'subcriptions',
                localField: "_id",
                foreignField: "subcriber",
                as: 'subcribeTo'
            }
        },
        {
            $addFields: {
                subcriberCount: {
                    $size: "$Subcribers"
                },
                channelSubcriberToCount: {
                    $size: "$subcribeTo"
                },
                isSubcribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$Subcribers.subcriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                username: 1,
                fullName: 1,
                subcriberCount: 1,
                channelSubcriberToCount: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(401, "channel docs not exist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, channel[0], "User channel is fetched successfully "))
})

const getWatchHistory = Asynchandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.user_.id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",

                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owners",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
                                    }
                                },

                            ]

                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }

    ])

    return res
        .status(200)
        .json(new ApiResponse(200, user[0].watchHistory, "watchHistory and owner fetch"))

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateDetails,
    updateAvatar,
    updateCoverIImage,
    getChannelProfile,
    getWatchHistory
}