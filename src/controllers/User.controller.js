import { Asynchandler } from '../utils/Asynchandler.js'
import { ApiError } from '../utils/APIerror.js';
import { User } from '../modal/User.modal.js'
import { UploadOnCloudinary } from '../Service/Cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js'

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
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        Coverimagepath = req.files.coverImage[0].path ;
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



export {
    registerUser
}