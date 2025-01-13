import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateDetails,
    updateAvatar,
    getCurrentUser,
    updateCoverImage,
    getChannelProfile,
    getWatchHistory
} from "../controllers/User.controller.js";
import { Upload } from '../middlewares/multer.middleware.js';
import { VerifyJWT } from "../middlewares/Auth.middleware.js"

const router = Router()

router.route('/register').post(
    Upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)

// secure Routes 
router.route("/logout").post(VerifyJWT, logoutUser)
router.route('/change-passowrd').post(VerifyJWT, changeCurrentPassword)
router.route('/current-user').get(VerifyJWT, getCurrentUser)
router.route('/update-details').patch(VerifyJWT, updateDetails)
router.route('/update-avatar').patch(VerifyJWT, Upload.single("avatar"), updateAvatar)
router.route('/update-coverImage').patch(VerifyJWT, Upload.single("coverImage"), updateCoverImage)
router.route('/channel/:username').get(VerifyJWT, getChannelProfile)
router.route('/watch-history').get(VerifyJWT, getWatchHistory)


export default router
