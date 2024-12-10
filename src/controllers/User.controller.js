import { Asynchandler } from '../utils/Asynchandler.js'
import { ApiError } from '../utils/APIerror.js';
import { User } from '../modal/User.modal.js'
import { UploadOnCloudinary } from '../Service/Cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from "jsonwebtoken"

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

    const { fullName, username, email, password } = req.body;

    if (
        [fullName, username, email, password].some((field) => field?.trim() == "")
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
        fullName,
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

    return res.status(201).json(
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
        secure: true
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
        secure: true
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
                {AccessToken, RefrehToken},
                "Access token refreshed"
            )
        )
    
    } catch (error) {
        throw new ApiError(401 , error?.message || "invalid refresh token");        
    }

})

export {
    registerUser,
    loginUser,
    logoutUser ,
    refreshAccessToken
}